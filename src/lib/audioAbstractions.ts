/**
 * Audio Abstractions for Axevora Live
 * Contains: DeviceManager, VoiceActivityDetector, and AudioQualityProfiles
 */

import { AudioQualityProfile } from "./liveRooms";

// ─── 1. AUDIO QUALITY PROFILES ────────────────────────────────────────────────
export interface AudioQualityConfig {
  sampleRate: number;
  channelCount: number;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  bitrate?: number;
}

export const AUDIO_QUALITY_PROFILES: Record<AudioQualityProfile, AudioQualityConfig> = {
  low: {
    sampleRate: 16000,
    channelCount: 1,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    bitrate: 24000
  },
  medium: {
    sampleRate: 32000,
    channelCount: 1,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    bitrate: 64000
  },
  high: {
    sampleRate: 48000,
    channelCount: 1,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    bitrate: 128000
  },
  music: {
    sampleRate: 48000,
    channelCount: 2,
    echoCancellation: false,
    noiseSuppression: false,
    autoGainControl: false,
    bitrate: 320000
  }
};

// ─── 2. DEVICE MANAGER ────────────────────────────────────────────────────────
export class DeviceManager {
  static async getAudioInputDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(d => d.kind === "audioinput");
    } catch (e) {
      console.error("[DeviceManager] Failed to list inputs", e);
      return [];
    }
  }

  static async getAudioOutputDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(d => d.kind === "audiooutput");
    } catch (e) {
      console.error("[DeviceManager] Failed to list outputs", e);
      return [];
    }
  }

  static async setAudioOutputDevice(element: HTMLAudioElement, deviceId: string): Promise<boolean> {
    try {
      // @ts-ignore
      if (typeof element.setSinkId === "function") {
        // @ts-ignore
        await element.setSinkId(deviceId);
        return true;
      }
      console.warn("[DeviceManager] setSinkId not supported in this browser");
      return false;
    } catch (e) {
      console.error("[DeviceManager] Failed to set sink ID", e);
      return false;
    }
  }
}

// ─── 3. VOICE ACTIVITY DETECTOR ───────────────────────────────────────────────
export class VoiceActivityDetector {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private checkInterval: any = null;
  private isSpeaking = false;

  constructor(
    private stream: MediaStream,
    private onSpeakingChange: (speaking: boolean) => void,
    private options = { threshold: -50, intervalMs: 100 }
  ) {}

  start() {
    try {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.source = this.audioCtx.createMediaStreamSource(this.stream);
      this.source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);

      this.checkInterval = setInterval(() => {
        if (!this.analyser) return;
        this.analyser.getFloatTimeDomainData(dataArray);

        // Compute Root Mean Square (RMS) decibels
        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sumSquares += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sumSquares / dataArray.length);
        const db = rms > 0 ? 20 * Math.log10(rms) : -100;

        const speakingNow = db > this.options.threshold;
        if (speakingNow !== this.isSpeaking) {
          this.isSpeaking = speakingNow;
          this.onSpeakingChange(this.isSpeaking);
        }
      }, this.options.intervalMs);

    } catch (e) {
      console.error("[VAD] Failed to initialize Voice Activity Detection", e);
    }
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.audioCtx && this.audioCtx.state !== "closed") {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    this.analyser = null;
  }
}

// ─── 4. BROWSER CAPABILITIES DETECTION ────────────────────────────────────────
export class BrowserCapabilities {
  static detectAll() {
    return {
      webRTC: typeof RTCPeerConnection !== "undefined",
      audioContext: typeof (window.AudioContext || (window as any).webkitAudioContext) !== "undefined",
      getDisplayMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia),
      mediaRecorder: typeof MediaRecorder !== "undefined",
    };
  }
}

// ─── 5. NETWORK QUALITY MONITOR ──────────────────────────────────────────────
export class NetworkQualityMonitor {
  private lastPingTime = 0;
  private pings: number[] = [];

  recordPingSent() {
    this.lastPingTime = performance.now();
  }

  recordPongReceived(): number {
    if (this.lastPingTime === 0) return 0;
    const latency = Math.round(performance.now() - this.lastPingTime);
    this.pings.push(latency);
    if (this.pings.length > 10) this.pings.shift();
    this.lastPingTime = 0;
    return latency;
  }

  getAveragePing(): number {
    if (this.pings.length === 0) return 0;
    return Math.round(this.pings.reduce((a, b) => a + b, 0) / this.pings.length);
  }

  getQualityRating(): "excellent" | "good" | "poor" {
    const avg = this.getAveragePing();
    if (avg === 0 || avg < 100) return "excellent";
    if (avg < 250) return "good";
    return "poor";
  }
}

// ─── 6. STRUCTURED EVENT BUS ──────────────────────────────────────────────────
export type AxevoraLiveEvent = 
  | { type: "ROOM_CREATED"; roomId: string; hostUid: string }
  | { type: "USER_JOINED"; roomId: string; uid: string; displayName: string }
  | { type: "MIC_ENABLED"; uid: string; enabled: boolean }
  | { type: "SYSTEM_AUDIO_STARTED"; uid: string }
  | { type: "HOST_TRANSFERRED"; oldHostUid: string; newHostUid: string };

type EventCallback = (event: AxevoraLiveEvent) => void;

class LiveEventBus {
  private listeners: Set<EventCallback> = new Set();

  subscribe(callback: EventCallback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  emit(event: AxevoraLiveEvent) {
    console.log(`[EventBus] ${event.type}`, event);
    this.listeners.forEach(cb => {
      try { cb(event); } catch (e) { console.error(e); }
    });
  }
}

export const AxevoraLiveEventBus = new LiveEventBus();
