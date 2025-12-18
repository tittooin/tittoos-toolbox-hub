
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import { Command } from 'lucide-react';

const MacCommandGenerator = () => {
    return (
        <GenericCommandTool
            title="MacOS Terminal Generator"
            description="Master your Mac. Generate Zsh commands for macOS workflows."
            osName="MacOS Zsh (Terminal)"
            icon={Command}
            keywords="mac terminal commands, zsh generator, macos cli helper, apple terminal"
        />
    );
};

export default MacCommandGenerator;
