
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import { Smartphone } from 'lucide-react';

const AndroidCommandGenerator = () => {
    return (
        <GenericCommandTool
            title="Android ADB Generator"
            description="Control your phone from your PC. Generate ADB and Fastboot commands."
            osName="Android ADB (Android Debug Bridge)"
            icon={Smartphone}
            keywords="adb command generator, fastboot commands, android terminal, adb shell helper"
        />
    );
};

export default AndroidCommandGenerator;
