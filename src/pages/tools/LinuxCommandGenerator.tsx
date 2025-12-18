
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import { Terminal } from 'lucide-react';

const LinuxCommandGenerator = () => {
    return (
        <GenericCommandTool
            title="Linux Terminal Generator"
            description="Generate Bash commands for Ubuntu, Debian, CentOS, and more."
            osName="Linux Bash"
            icon={Terminal}
            keywords="linux command generator, bash script generator, ubuntu terminal helper, linux cli"
        />
    );
};

export default LinuxCommandGenerator;
