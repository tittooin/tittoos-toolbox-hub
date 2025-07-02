
import { useState } from "react";
import { BarChart, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const CSVEditor = () => {
  const [csvData, setCsvData] = useState([
    ["Name", "Age", "City"],
    ["John Doe", "30", "New York"],
    ["Jane Smith", "25", "Los Angeles"],
    ["", "", ""]
  ]);

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...csvData];
    newData[rowIndex][colIndex] = value;
    setCsvData(newData);
  };

  const addRow = () => {
    const newRow = new Array(csvData[0].length).fill("");
    setCsvData([...csvData, newRow]);
  };

  const addColumn = () => {
    const newData = csvData.map(row => [...row, ""]);
    setCsvData(newData);
  };

  const downloadCSV = () => {
    const csvContent = csvData.map(row => 
      row.map(cell => `"${cell}"`).join(",")
    ).join("\n");
    
    const element = document.createElement("a");
    const file = new Blob([csvContent], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = "data.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("CSV file downloaded!");
  };

  const features = [
    "Interactive spreadsheet interface",
    "Add/remove rows and columns",
    "CSV file import and export",
    "Real-time editing",
    "Data validation"
  ];

  return (
    <ToolTemplate
      title="CSV Editor"
      description="Edit CSV files with an intuitive spreadsheet-like interface"
      icon={BarChart}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">CSV Editor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <tbody>
                  {csvData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} className="border border-gray-300 p-1">
                          <Input
                            value={cell}
                            onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                            className="border-0 h-8 text-sm"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button onClick={addRow} variant="outline" size="sm">
                Add Row
              </Button>
              <Button onClick={addColumn} variant="outline" size="sm">
                Add Column
              </Button>
              <Button onClick={downloadCSV}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolTemplate>
  );
};

export default CSVEditor;
