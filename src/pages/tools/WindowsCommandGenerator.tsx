
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import { Terminal } from 'lucide-react';

const WindowsCommandGenerator = () => {
    return (
        <GenericCommandTool
            title="Windows PowerShell Generator"
            description="Translate plain English into advanced PowerShell commands instantly."
            osName="Windows PowerShell 7+"
            icon={Terminal}
            keywords="powershell generator, windows terminal commands, ps1 script generator, windows cli helper"
        />
    );
};

export default WindowsCommandGenerator;
