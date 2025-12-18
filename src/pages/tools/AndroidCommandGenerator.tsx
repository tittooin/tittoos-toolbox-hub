
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import { Smartphone, Usb, Settings, FileBox, RefreshCw } from 'lucide-react';

const AndroidCommandGenerator = () => {
    return (
        <GenericCommandTool
            title="ADB & Fastboot Cheatsheet"
            description="The ultimate guide to Android Debug Bridge. Generate commands to control, flash, and debug any Android device."
            osName="Android ADB"
            icon={Smartphone}
            keywords="adb commands, fastboot cheatsheet, android terminal, apk install, adb shell, logcat"
        >
            <div className="space-y-12">

                {/* Intro */}
                <div>
                    <h2 className="text-3xl font-bold mb-6">Control Your Android</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        ADB (Android Debug Bridge) is the Swiss-army knife for Android. It allows you to send commands from your computer to your phone via USB or Wi-Fi.
                        <strong>Fastboot</strong> is used when modifying the device internals (flashing OS, recovery).
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Connection & Basics */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <Usb className="text-green-500" />
                            <h3 className="text-2xl font-bold m-0">Connection Basics</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b"><th className="pb-2">Command</th><th className="pb-2">Function</th></tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr><td className="py-2 font-mono text-green-600">adb devices</td><td>List connected phones</td></tr>
                                <tr><td className="py-2 font-mono text-green-600">adb connect [ip]</td><td>Connect via Wi-Fi</td></tr>
                                <tr><td className="py-2 font-mono text-green-600">adb kill-server</td><td>Restart ADB service</td></tr>
                                <tr><td className="py-2 font-mono text-green-600">adb reboot</td><td>Restart Phone</td></tr>
                                <tr><td className="py-2 font-mono text-green-600">adb reboot recovery</td><td>Go to Recovery Mode</td></tr>
                                <tr><td className="py-2 font-mono text-green-600">adb reboot bootloader</td><td>Go to Fastboot Mode</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* App Management */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <FileBox className="text-blue-500" />
                            <h3 className="text-2xl font-bold m-0">App Management</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b"><th className="pb-2">Command</th><th className="pb-2">Function</th></tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr><td className="py-2 font-mono text-blue-600">adb install [file.apk]</td><td>Install APK</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">adb install -r [file]</td><td>Update/Re-install App</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">adb uninstall [pkg]</td><td>Remove App</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">adb shell pm list packages</td><td>List all installed apps</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">adb shell pm list packages -3</td><td>List only user apps</td></tr>
                                <tr><td className="py-2 font-mono text-blue-600">adb shell pm clear [pkg]</td><td>Clear App Data</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* File Transfer & Logs */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <Settings className="text-orange-500" />
                            <h3 className="text-2xl font-bold m-0">Files & Debugging</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b"><th className="pb-2">Command</th><th className="pb-2">Function</th></tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr><td className="py-2 font-mono text-orange-600">adb push [local] [remote]</td><td>PC &rarr; Phone</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">adb pull [remote] [local]</td><td>Phone &rarr; PC</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">adb shell ls /sdcard/</td><td>List phone files</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">adb logcat</td><td>View Live System Logs</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">adb logcat -c</td><td>Clear Logs</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">adb shell screencap -p /sdcard/s.png</td><td>Take Screenshot</td></tr>
                                <tr><td className="py-2 font-mono text-orange-600">adb shell screenrecord /sdcard/v.mp4</td><td>Record Screen info video</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Fastboot */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b pb-2">
                            <RefreshCw className="text-red-500" />
                            <h3 className="text-2xl font-bold m-0">Fastboot (Advanced)</h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b"><th className="pb-2">Command</th><th className="pb-2">Function</th></tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr><td className="py-2 font-mono text-red-600">fastboot devices</td><td>Check connection (Bootloader)</td></tr>
                                <tr><td className="py-2 font-mono text-red-600">fastboot oem unlock</td><td>Unlock Bootloader (Wipe)</td></tr>
                                <tr><td className="py-2 font-mono text-red-600">fastboot flash recovery [img]</td><td>Install Custom Recovery</td></tr>
                                <tr><td className="py-2 font-mono text-red-600">fastboot flash boot [img]</td><td>Flash Kernel/Boot</td></tr>
                                <tr><td className="py-2 font-mono text-red-600">fastboot reboot</td><td>Restart normally</td></tr>
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>
        </GenericCommandTool>
    );
};

export default AndroidCommandGenerator;
