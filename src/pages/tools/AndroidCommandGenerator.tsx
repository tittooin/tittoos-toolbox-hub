
import React from 'react';
import GenericCommandTool from "@/components/GenericCommandTool";
import { Smartphone, Usb, Cpu, Settings } from 'lucide-react';

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
                        The <code>adb</code> command facilitates a variety of device actions, such as installing and debugging apps,
                        and it provides access to a Unix shell that you can use to run a variety of commands on a device.
                        Whether you are a developer debugging an app or an enthusiast debloating your Samsung phone, ADB is the key.
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
                            <strong>Fastboot</strong> works when Android is NOT booted (in the Bootloader mode). It is used to flash firmware, recovery images (TWRP), or unlock the bootloader.
                        </p>
                    </div>

                    <div className="bg-card border rounded-2xl p-6 shadow-sm">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                            <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Developer Options</h3>
                        <p className="text-muted-foreground">
                            To use ADB, you must first enable "USB Debugging" on your phone. Go to
                            <em> Settings {`>`} About Phone</em> and tap <strong>Build Number</strong> 7 times to unlock Developer Options.
                        </p>
                    </div>
                </div>

                {/* Deep Dive */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">Common ADB Use Cases</h2>

                    <div className="prose dark:prose-invert max-w-none">
                        <h3>1. Debloating (Removing Pre-installed Apps)</h3>
                        <p>
                            Manufacturers often install apps you can't uninstall via the UI.
                            However, you can uninstall them for the current user via ADB:
                        </p>
                        <div className="bg-muted p-4 rounded-lg font-mono text-sm not-prose">
                            adb shell pm uninstall -k --user 0 com.samsung.android.bloatware
                        </div>

                        <h3>2. File Transfer</h3>
                        <p>
                            Moving files over MTP (standard USB file transfer) can be slow or buggy on Mac/Linux.
                            ADB Push/Pull is reliable.
                        </p>
                        <ul>
                            <li><code>adb push movie.mkv /sdcard/Movies/</code> (PC to Phone)</li>
                            <li><code>adb pull /sdcard/DCIM/Camera .</code> (Phone to PC)</li>
                        </ul>

                        <h3>3. Screen Recording & Mirroring</h3>
                        <p>
                            You can record your phone's screen directly to your PC via CLI:
                            <code>adb shell screenrecord /sdcard/demo.mp4</code>.
                        </p>
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
                        <div className="flex items-start gap-3">
                            <span className="font-bold text-red-500">3. Fastboot Waiting?</span>
                            <p className="text-sm text-muted-foreground mt-1">If stuck on "waiting for device" in fastboot, use a USB 2.0 port. USB 3.0/C ports sometimes cause handshake issues on older devices.</p>
                        </div>
                    </div>
                </div>

            </div>
        </GenericCommandTool>
    );
};

export default AndroidCommandGenerator;
