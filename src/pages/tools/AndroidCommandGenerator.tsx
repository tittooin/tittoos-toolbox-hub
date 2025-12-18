
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import { Smartphone, Usb, Settings, List } from 'lucide-react';

const AndroidCommandGenerator = () => {
    return (
        <GenericCommandTool
            title="Android ADB Generator"
            description="Control your phone from your PC. Generate ADB and Fastboot commands."
            osName="Android ADB (Android Debug Bridge)"
            icon={Smartphone}
            keywords="adb command generator, fastboot commands, android terminal, adb shell helper"
        >
            <div className="space-y-12">

                {/* Intro */}
                <div>
                    <h2 className="text-3xl font-bold mb-6">Unlocking Android's Potential</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Android Debug Bridge (ADB) is a versatile command-line tool that lets you communicate with a device.
                        The <code>adb</code> command facilitates a variety of device actions, such as installing and debugging apps.
                    </p>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                            <Usb className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">ADB vs Fastboot</h3>
                        <p className="text-muted-foreground">
                            <strong>ADB</strong> works when Android is fully booted. It helps with file transfers and app management.<br />
                            <strong>Fastboot</strong> works when Android is NOT booted (in the Bootloader mode). It is used to flash firmware.
                        </p>
                    </div>

                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                            <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Developer Options</h3>
                        <p className="text-muted-foreground">
                            To use ADB, you must first enable "USB Debugging" on your phone. Go to
                            <em> Settings {`>`} About Phone</em> and tap <strong>Build Number</strong> 7 times.
                        </p>
                    </div>
                </div>

                {/* Reference Table */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b pb-4">
                        <List className="w-8 h-8 text-primary" />
                        <h2 className="text-3xl font-bold m-0">Essential ADB & Fastboot Commands</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-4 font-bold text-lg w-1/3">Command</th>
                                    <th className="p-4 font-bold text-lg">Function</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr>
                                    <td className="p-4 font-mono text-green-600 dark:text-green-400">adb devices</td>
                                    <td className="p-4">Check if your device is connected and authorized.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-green-600 dark:text-green-400">adb shell</td>
                                    <td className="p-4">Enter a remote Linux shell on your device.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-green-600 dark:text-green-400">adb install app.apk</td>
                                    <td className="p-4">Install an APK file from your computer to the phone.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-green-600 dark:text-green-400">adb push local remote</td>
                                    <td className="p-4">Copy file FROM Computer TO Phone. <br /><code className="text-xs bg-muted p-1">adb push song.mp3 /sdcard/Music/</code></td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-green-600 dark:text-green-400">adb pull remote local</td>
                                    <td className="p-4">Copy file FROM Phone TO Computer. <br /><code className="text-xs bg-muted p-1">adb pull /sdcard/DCIM/Camera .</code></td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-green-600 dark:text-green-400">adb logcat</td>
                                    <td className="p-4">Stream system logs (useful for debugging crashes).</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-green-600 dark:text-green-400">adb reboot bootloader</td>
                                    <td className="p-4">Restart the phone into Fastboot mode.</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-green-600 dark:text-green-400">fastboot oem unlock</td>
                                    <td className="p-4">Unlock the bootloader (WARNING: Wipes valid data).</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-mono text-green-600 dark:text-green-400">fastboot flash recovery twrp.img</td>
                                    <td className="p-4">Flash a custom recovery partition (Advanced).</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Troubleshooting */}
                <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border">
                    <h2 className="text-2xl font-bold mb-4">Troubleshooting Connection</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <span className="font-bold text-red-500">1. Unauthorized?</span>
                            <p className="text-sm text-muted-foreground mt-1">If <code>adb devices</code> shows "unauthorized", check your phone screen. You need to accept the RSA fingerprint popup.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="font-bold text-red-500">2. Device not found?</span>
                            <p className="text-sm text-muted-foreground mt-1">Ensure you have the correct USB Drivers (Google USB Driver for Pixel, Samsung Drivers for Samsung) installed on Windows.</p>
                        </div>
                    </div>
                </div>

            </div>
        </GenericCommandTool>
    );
};

export default AndroidCommandGenerator;
