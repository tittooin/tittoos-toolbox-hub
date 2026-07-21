import { 
  ComparisonRequest, 
  ProductComparisonResult, 
  ComparisonDimension, 
  ProductIntelligenceResult 
} from './types';
import { ComparisonDimensionResolver } from './ComparisonDimensionResolver';

export class ComparisonRecommendationService {
  constructor(private dimensionResolver: ComparisonDimensionResolver) {}

  /**
   * Evaluates comparison request details, runs dynamic normalized scoring, 
   * and generates explainable product recommendations.
   * 
   * @param request ComparisonRequest input details
   * @param margin Threshold points below which it is a tie (default 5)
   * @param minDimensions Minimum required compared dimensions to make a recommendation (default 2)
   * @returns ProductComparisonResult
   */
  public async compareAndRecommend(
    request: ComparisonRequest,
    margin: number = 5,
    minDimensions: number = 2
  ): Promise<ProductComparisonResult> {
    const target = request.target;
    const candidates = request.candidates;
    const intent = request.intent || 'BEST_OVERALL';

    const targetId = target.productFacts.title?.value || 'target_product';
    const comparisonSet = [
      targetId,
      ...candidates.map((c) => c.productIntelligence.productFacts.title?.value || c.productId),
    ];

    const result: ProductComparisonResult = {
      targetId,
      comparisonSet,
      dimensions: [],
      confidence: 'LOW',
      warnings: [],
      strategyVersion: '1.0.0',
    };

    // Category Eligibility Gate
    const categoryId = target.productFacts.taxonomyIds?.value?.[0];
    if (!categoryId) {
      result.recommendation = {
        outcome: 'INSUFFICIENT_EVIDENCE',
        score: 0,
        intent,
        explanation: 'Target category taxonomy is unresolved.',
        reasons: [],
        pros: {},
        cons: {},
      };
      result.warnings.push('Target product does not have a canonical category resolved');
      return result;
    }

    // Collect all attributes from target and candidates to resolve profile
    const allAttrKeysSet = new Set<string>();
    if (target.productFacts.customAttributes?.value) {
      Object.keys(target.productFacts.customAttributes.value).forEach((k) => allAttrKeysSet.add(k));
    }
    candidates.forEach((c) => {
      if (c.productIntelligence.productFacts.customAttributes?.value) {
        Object.keys(c.productIntelligence.productFacts.customAttributes.value).forEach((k) =>
          allAttrKeysSet.add(k)
        );
      }
    });

    const profile = this.dimensionResolver.resolve(categoryId, Array.from(allAttrKeysSet));

    // Construct Product Maps for easy access
    const productsMap = new Map<string, ProductIntelligenceResult>();
    productsMap.set(targetId, target);
    candidates.forEach((c) => {
      const id = c.productIntelligence.productFacts.title?.value || c.productId;
      productsMap.set(id, c.productIntelligence);
    });

    // Populate comparison matrix values
    const dimensionsList: ComparisonDimension[] = [];
    for (const dimName of profile.dimensions) {
      const dimLabel = profile.labels[dimName] || dimName;
      const dimType = profile.types[dimName] || 'categorical';
      const dimDirection = profile.directions[dimName] || 'NEUTRAL';

      const values: Record<string, string> = {};
      for (const prodId of comparisonSet) {
        const prod = productsMap.get(prodId);
        if (!prod) {
          values[prodId] = 'UNKNOWN';
          continue;
        }

        if (dimName === 'price') {
          const priceObj = prod.commerceFacts.price?.value;
          values[prodId] = priceObj ? `${priceObj.amount} ${priceObj.currency}` : 'UNKNOWN';
        } else {
          const attrs = prod.productFacts.customAttributes?.value;
          values[prodId] = attrs && attrs[dimName] !== undefined ? String(attrs[dimName]) : 'UNKNOWN';
        }
      }

      dimensionsList.push({
        name: dimName,
        label: dimLabel,
        type: dimType,
        direction: dimDirection,
        values,
      });
    }
    result.dimensions = dimensionsList;

    // Calculate utility scores with signal weight normalization
    const utilityScores: Record<string, number> = {};
    const priceAdvantageScores: Record<string, number> = {};
    const hasFreshPriceMap: Record<string, boolean> = {};
    
    let verifiedDimensionsMatched = 0;

    // First, resolve numeric values to perform relative price normalization
    const freshPrices: number[] = [];
    for (const prodId of comparisonSet) {
      const prod = productsMap.get(prodId);
      const priceObj = prod?.commerceFacts.price;
      const isFresh = priceObj !== undefined && priceObj.confidence !== 'LOW';
      hasFreshPriceMap[prodId] = isFresh;
      
      if (isFresh && priceObj.value) {
        freshPrices.push(priceObj.value.amount);
      }
    }

    const minPrice = freshPrices.length > 0 ? Math.min(...freshPrices) : 0;
    const maxPrice = freshPrices.length > 0 ? Math.max(...freshPrices) : 0;

    for (const prodId of comparisonSet) {
      const prod = productsMap.get(prodId);
      if (!prod) {
        utilityScores[prodId] = 0;
        continue;
      }

      let scoreSum = 0;
      let totalActiveWeight = 0;
      let comparedDims = 0;

      for (const dim of dimensionsList) {
        const valStr = dim.values[prodId];
        if (valStr === 'UNKNOWN') {
          continue; // Normalize active weights: ignore missing details
        }

        const weight = profile.weights[dim.name] || 0.1;
        let dimScore = 100;

        if (dim.type === 'numeric') {
          // Parse all valid numeric values in comparison set
          const numList: number[] = [];
          for (const pid of comparisonSet) {
            const pval = dimensionsList.find((d) => d.name === dim.name)?.values[pid];
            if (pval && pval !== 'UNKNOWN') {
              const num = parseFloat(pval);
              if (!isNaN(num)) numList.push(num);
            }
          }

          const currentNum = parseFloat(valStr);
          if (!isNaN(currentNum) && numList.length > 0) {
            const dMax = Math.max(...numList);
            const dMin = Math.min(...numList);

            if (dMax !== dMin) {
              if (dim.direction === 'HIGHER_BETTER') {
                dimScore = 100 * (currentNum - dMin) / (dMax - dMin);
              } else if (dim.direction === 'LOWER_BETTER') {
                dimScore = 100 * (dMax - currentNum) / (dMax - dMin);
              }
            }
            
            if (dim.name === 'price') {
              const priceObj = prod.commerceFacts.price;
              if (priceObj && priceObj.confidence === 'LOW') {
                dimScore = Math.max(0, dimScore - 15);
                result.warnings.push(`Stale candidate price for product "${prodId}" lowered price proximity score`);
              }
            }
            comparedDims++;
          }
        } else if (dim.type === 'categorical') {
          const targetVal = dimensionsList.find((d) => d.name === dim.name)?.values[targetId];
          if (targetVal !== 'UNKNOWN') {
            dimScore = valStr.toLowerCase() === targetVal.toLowerCase() ? 100 : 70;
            comparedDims++;
          }
        } else if (dim.type === 'boolean') {
          const isTrue = valStr.toLowerCase() === 'true' || valStr === '1';
          dimScore = isTrue ? 100 : 0;
          comparedDims++;
        }

        scoreSum += dimScore * weight;
        totalActiveWeight += weight;
      }

      utilityScores[prodId] = totalActiveWeight > 0 ? Math.round(scoreSum / totalActiveWeight) : 0;

      // Compute Price Advantage Score for Best Value
      if (hasFreshPriceMap[prodId] && prod.commerceFacts.price?.value) {
        const curPrice = prod.commerceFacts.price.value.amount;
        if (maxPrice === minPrice) {
          priceAdvantageScores[prodId] = 100;
        } else {
          priceAdvantageScores[prodId] = Math.round(100 * (maxPrice - curPrice) / (maxPrice - minPrice));
        }
      }
    }

    // Verify minimum evidence gate
    for (const dim of dimensionsList) {
      const validCount = comparisonSet.filter((pid) => dim.values[pid] !== 'UNKNOWN').length;
      if (validCount >= 2) {
        verifiedDimensionsMatched++;
      }
    }

    if (verifiedDimensionsMatched < minDimensions) {
      result.recommendation = {
        outcome: 'INSUFFICIENT_EVIDENCE',
        score: 0,
        intent,
        explanation: `Insufficient comparable evidence. Minimum of ${minDimensions} matching dimensions required.`,
        reasons: [],
        pros: {},
        cons: {},
      };
      result.warnings.push('Comparison calculations skipped due to lack of comparable specs');
      return result;
    }

    // Determine Final Recommendation Scores based on intent
    const finalScores: Record<string, number> = {};
    if (intent === 'BEST_VALUE') {
      const freshPricesCount = Object.values(hasFreshPriceMap).filter(Boolean).length;
      if (freshPricesCount < 2) {
        result.recommendation = {
          outcome: 'VALUE_RECOMMENDATION_UNAVAILABLE',
          score: 0,
          intent,
          explanation: 'Best Value recommendation requires at least 2 comparable fresh prices.',
          reasons: [],
          pros: {},
          cons: {},
        };
        result.warnings.push('Value recommendations unavailable due to missing/stale prices');
        return result;
      }

      // Best Value score = 50% utility score + 50% price advantage score
      for (const prodId of comparisonSet) {
        if (hasFreshPriceMap[prodId]) {
          finalScores[prodId] = Math.round(0.5 * utilityScores[prodId] + 0.5 * priceAdvantageScores[prodId]);
        } else {
          finalScores[prodId] = 0; // ineligible due to missing/stale price
        }
      }
    } else {
      // BEST_OVERALL is the utility score directly
      for (const prodId of comparisonSet) {
        finalScores[prodId] = utilityScores[prodId];
      }
    }

    // Winner Selection
    const rankedIds = [...comparisonSet].sort((a, b) => finalScores[b] - finalScores[a]);
    const topId = rankedIds[0];
    const topScore = finalScores[topId];
    const runnerId = rankedIds[1];
    const runnerScore = finalScores[runnerId];

    const reasons: string[] = [];
    const explanation = `Recommended product is ${topId} with score ${topScore} based on verified features.`;

    let outcome: 'WINNER' | 'NO_CLEAR_WINNER' = 'WINNER';
    let winnerId: string | undefined = topId;

    if (topScore - runnerScore < margin) {
      outcome = 'NO_CLEAR_WINNER';
      winnerId = undefined;
      reasons.push('Products are too close in capability score difference.');
    }

    // Deriving structured Pros and Cons
    const pros: Record<string, string[]> = {};
    const cons: Record<string, string[]> = {};

    for (const prodId of comparisonSet) {
      pros[prodId] = [];
      cons[prodId] = [];

      for (const dim of dimensionsList) {
        const valStr = dim.values[prodId];
        if (valStr === 'UNKNOWN') continue;

        const valNum = parseFloat(valStr);
        if (isNaN(valNum)) continue;

        // Collect other values for comparison
        const allNums: number[] = [];
        for (const pid of comparisonSet) {
          const pv = dim.values[pid];
          if (pv !== 'UNKNOWN') {
            const n = parseFloat(pv);
            if (!isNaN(n)) allNums.push(n);
          }
        }

        const dMax = Math.max(...allNums);
        const dMin = Math.min(...allNums);

        if (dMax !== dMin) {
          if (valNum === dMax && dim.direction === 'HIGHER_BETTER') {
            pros[prodId].push(`Higher verified ${dim.label}`);
          } else if (valNum === dMin && dim.direction === 'LOWER_BETTER') {
            pros[prodId].push(`Lower verified ${dim.label}`);
          } else if (valNum === dMin && dim.direction === 'HIGHER_BETTER') {
            cons[prodId].push(`Lower verified ${dim.label}`);
          } else if (valNum === dMax && dim.direction === 'LOWER_BETTER') {
            cons[prodId].push(`Higher verified ${dim.label}`);
          }
        }
      }
    }

    // Determine reasons logs for winner details
    if (outcome === 'WINNER') {
      const winnerPros = pros[topId] || [];
      if (winnerPros.length > 0) {
        reasons.push(`${topId} excels due to: ${winnerPros.slice(0, 2).join(', ')}.`);
      } else {
        reasons.push(`${topId} scored highest in category comparisons.`);
      }
    }

    result.recommendation = {
      winnerId,
      outcome,
      score: topScore,
      intent,
      explanation,
      reasons,
      pros,
      cons,
    };

    // Calculate Recommendation Confidence based on completeness and provenance coverage
    let verifiedCount = 0;
    let totalCount = 0;

    for (const prodId of comparisonSet) {
      const prod = productsMap.get(prodId);
      if (prod) {
        if (prod.productFacts.title?.confidence === 'VERIFIED') verifiedCount++;
        totalCount++;
      }
    }

    const verificationRatio = totalCount > 0 ? verifiedCount / totalCount : 0;
    if (verificationRatio >= 0.8 && target.completeness === 'COMPARISON_READY') {
      result.confidence = 'HIGH';
    } else if (verificationRatio >= 0.5) {
      result.confidence = 'MEDIUM';
    } else {
      result.confidence = 'LOW';
      result.warnings.push('Low recommendation confidence due to incomplete taxonomy or unverified data source provenance');
    }

    return result;
  }
}
