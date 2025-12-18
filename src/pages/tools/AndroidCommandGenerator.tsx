
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import CommandCheatsheet from "@/components/CommandCheatsheet";
import { Smartphone, Usb, Settings, FileBox, RefreshCw } from 'lucide-react';

const AndroidCommandGenerator = () => {

    const categories = [
        {
            title: "Connection & Basics",
            icon: Usb,
            colorClass: "text-green-500",
            commands: [
                { cmd: "adb devices", desc: "List connected & authorized devices" },
                { cmd: "adb connect 192.168.1.5", desc: "Connect via Wi-Fi" },
                { cmd: "adb kill-server", desc: "Restart ADB background service" },
                { cmd: "adb reboot", desc: "Restart phone" },
                { cmd: "adb reboot recovery", desc: "Reboot to Recovery Mode" },
                { cmd: "adb reboot bootloader", desc: "Reboot to Fastboot Mode" },
            ]
        },
        {
            title: "App Management",
            icon: FileBox,
            colorClass: "text-blue-500",
            commands: [
                { cmd: "adb install app.apk", desc: "Install an APK file" },
                { cmd: "adb install -r app.apk", desc: "Update existing app" },
                { cmd: "adb uninstall com.package.name", desc: "Uninstall an app" },
                { cmd: "adb shell pm list packages", desc: "List all installed packages" },
                { cmd: "adb shell pm clear com.package", desc: "Clear app data/cache" },
                { cmd: "adb shell am start -n com.pkg/.Activity", desc: "Launch specific app activity" },
            ]
        },
        {
            title: "Files & Logs",
            icon: Settings,
            colorClass: "text-orange-500",
            commands: [
                { cmd: "adb push PC_File.txt /sdcard/", desc: "Copy from Computer to Phone" },
                { cmd: "adb pull /sdcard/Photo.jpg .", desc: "Copy from Phone to Computer" },
                { cmd: "adb shell ls /sdcard/", desc: "List files on phone" },
                { cmd: "adb logcat", desc: "Stream live system logs" },
                { cmd: "adb logcat -c", desc: "Clear log buffer" },
                { cmd: "adb shell screencap /sdcard/s.png", desc: "Take screenshot on device" },
                { cmd: "adb shell screenrecord /sdcard/v.mp4", desc: "Record screen to video" },
            ]
        },
        {
            title: "Fastboot (Bootloader)",
            icon: RefreshCw,
            colorClass: "text-red-500",
            commands: [
                { cmd: "fastboot devices", desc: "Check connection in Bootloader" },
                { cmd: "fastboot oem unlock", desc: "Unlock Bootloader (Wipes Data)" },
                { cmd: "fastboot flash recovery twrp.img", desc: "Install Custom Recovery" },
                { cmd: "fastboot flash boot boot.img", desc: "Flash Kernel/Boot image" },
                { cmd: "fastboot reboot", desc: "Reboot to System" },
                { cmd: "fastboot getvar all", desc: "Show detailed device info" },
            ]
        }
    ];

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
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        Everything you need for Android development and modding. Use the interactive cheatsheet below to find commands for simple file transfers or advanced firmware flashing.
                    </p>
                    <div className="bg-muted/50 p-6 rounded-xl border border-border">
                        <CommandCheatsheet categories={categories} />
                    </div>
                </div>

                {/* Troubleshooting */}
                <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border">
                    <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <span className="font-bold text-red-500">Device Unauthorized?</span>
                            <p className="text-sm text-muted-foreground mt-1">If <code>adb devices</code> says 'unauthorized', wake up your phone and accept the "Allow USB Debugging" popup.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="font-bold text-red-500">Fastboot Waiting?</span>
                            <p className="text-sm text-muted-foreground mt-1">Fastboot requires specific drivers. If it says "waiting for device", check Device Manager in Windows and install "Android Bootloader Interface" driver manually.</p>
                        </div>
                    </div>
                </div>

            </div>
        </GenericCommandTool>
    );
};

export default AndroidCommandGenerator;
