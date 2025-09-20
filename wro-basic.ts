
/**
* This library is a stripped down and modified "port" 
* of the official Elecfreaks PlanetX sensor library 
* that includes function useful to WRO RoboMission
* category.
*/


/**
 * Custom blocks
 */
//% weight=100 color=#edca1a icon="\uf0e7"
namespace PlanetX_WRO {

    export enum TrackbitType {
        //% block="◌" 
        State_0 = 0,
        //% block="●" 
        State_1 = 1
    }
    export enum TrackbitChannel {
        //% block="1"
        One = 0,
        //% block="2"
        Two = 1,
        //% block="3"
        Three = 2,
        //% block="4"
        Four = 3
    }

    export enum ColorList {
        //% block="Red"
        red,
        //% block="Green"
        green,
        //% block="Blue"
        blue,
        //% block="Cyan"
        cyan,
        //% block="Magenta"
        magenta,
        //% block="Yellow"
        yellow,
        //% block="White"
        white
    }

    /////////////////////////color/////////////////////////
    const APDS9960_ADDR = 0x39
    const APDS9960_ENABLE = 0x80
    const APDS9960_ATIME = 0x81
    const APDS9960_CONTROL = 0x8F
    const APDS9960_STATUS = 0x93
    const APDS9960_CDATAL = 0x94
    const APDS9960_CDATAH = 0x95
    const APDS9960_RDATAL = 0x96
    const APDS9960_RDATAH = 0x97
    const APDS9960_GDATAL = 0x98
    const APDS9960_GDATAH = 0x99
    const APDS9960_BDATAL = 0x9A
    const APDS9960_BDATAH = 0x9B
    const APDS9960_GCONF4 = 0xAB
    const APDS9960_AICLEAR = 0xE7
    let color_first_init = false
    let color_new_init = false

    function i2cwrite_color(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }
    function i2cread_color(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function rgb2hsl(color_r: number, color_g: number, color_b: number): number {
        let Hue = 0
        let R = color_r * 100 / 255;
        let G = color_g * 100 / 255;
        let B = color_b * 100 / 255;
        let maxVal = Math.max(R, Math.max(G, B))
        let minVal = Math.min(R, Math.min(G, B))
        let Delta = maxVal - minVal;

        if (Delta < 0) {
            Hue = 0;
        }
        else if (maxVal == R && G >= B) {
            Hue = (60 * ((G - B) * 100 / Delta)) / 100;
        }
        else if (maxVal == R && G < B) {
            Hue = (60 * ((G - B) * 100 / Delta) + 360 * 100) / 100;
        }
        else if (maxVal == G) {
            Hue = (60 * ((B - R) * 100 / Delta) + 120 * 100) / 100;
        }
        else if (maxVal == B) {
            Hue = (60 * ((R - G) * 100 / Delta) + 240 * 100) / 100;
        }
        return Hue
    }

    function initModule(): void {
        i2cwrite_color(APDS9960_ADDR, APDS9960_ATIME, 252)
        i2cwrite_color(APDS9960_ADDR, APDS9960_CONTROL, 0x03)
        i2cwrite_color(APDS9960_ADDR, APDS9960_ENABLE, 0x00)
        i2cwrite_color(APDS9960_ADDR, APDS9960_GCONF4, 0x00)
        i2cwrite_color(APDS9960_ADDR, APDS9960_AICLEAR, 0x00)
        i2cwrite_color(APDS9960_ADDR, APDS9960_ENABLE, 0x01)
        color_first_init = true
    }
    function colorMode(): void {
        let tmp = i2cread_color(APDS9960_ADDR, APDS9960_ENABLE) | 0x2;
        i2cwrite_color(APDS9960_ADDR, APDS9960_ENABLE, tmp);
    }
    

    /**
    * Gets the position offset.The range is from -3000 to 3000.
    */
    //% sensor_number.fieldEditor="gridpicker" sensor_number.fieldOptions.columns=2
    //% subcategory=Trackbit group="IIC Port"
    //% block="Trackbit sensor offset value"
    export function TrackBit_get_offset(): number {
        let offset: number
        pins.i2cWriteNumber(0x1a, 5, NumberFormat.Int8LE)
        const offsetH = pins.i2cReadNumber(0x1a, NumberFormat.UInt8LE, false)
        pins.i2cWriteNumber(0x1a, 6, NumberFormat.Int8LE)
        const offsetL = pins.i2cReadNumber(0x1a, NumberFormat.UInt8LE, false)
        offset = (offsetH << 8) | offsetL
        offset = Math.map(offset, 0, 6000, -3000, 3000)
        return offset;
    }

    /**
    * Get gray value.The range is from 0 to 255.
    */
    //% channel.fieldEditor="gridpicker" channel.fieldOptions.columns=4
    //% subcategory=Trackbit group="IIC Port"
    //% block="Trackbit channel %channel gray value"
    export function TrackbitgetGray(channel: TrackbitChannel): number {
        pins.i2cWriteNumber(0x1a, channel, NumberFormat.Int8LE)
        return pins.i2cReadNumber(0x1a, NumberFormat.UInt8LE, false)
    }


    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    //% channel.fieldEditor="gridpicker" channel.fieldOptions.columns=4
    //% subcategory=Trackbit group="IIC Port"
    //% block="Trackbit channel %channel is %state"
    export function TrackbitChannelState(channel: TrackbitChannel, state: TrackbitType): boolean {
        let TempVal: number = 0
        pins.i2cWriteNumber(0x1a, 4, NumberFormat.Int8LE)
        TempVal = pins.i2cReadNumber(0x1a, NumberFormat.UInt8LE, false)
        if (state == TrackbitType.State_1)
            if (TempVal & 1 << channel) {
                return true
            }
            else {
                return false
            }
        else {
            if (TempVal & 1 << channel) {
                return false
            }
            else {
                return true
            }
        }
    }


    //% blockId=apds9960_readcolor block="Color sensor IIC port color HUE(0~360)"
    //% subcategory=ColorSensor group="IIC Port"
    export function readColor(): number {
        let buf = pins.createBuffer(2)
        let c = 0
        let r = 0
        let g = 0
        let b = 0
        let temp_c = 0
        let temp_r = 0
        let temp_g = 0
        let temp_b = 0
        let temp = 0

        if (color_new_init == false && color_first_init == false) {
            let i = 0;
            while (i++ < 20) {
                buf[0] = 0x81
                buf[1] = 0xCA
                pins.i2cWriteBuffer(0x43, buf)
                buf[0] = 0x80
                buf[1] = 0x17
                pins.i2cWriteBuffer(0x43, buf)
                basic.pause(50);

                if ((i2cread_color(0x43, 0xA4) + i2cread_color(0x43, 0xA5) * 256) != 0) {
                    color_new_init = true
                    break;
                }
            }
        }
        if (color_new_init == true) {
            basic.pause(100);
            c = i2cread_color(0x43, 0xA6) + i2cread_color(0x43, 0xA7) * 256;
            r = i2cread_color(0x43, 0xA0) + i2cread_color(0x43, 0xA1) * 256;
            g = i2cread_color(0x43, 0xA2) + i2cread_color(0x43, 0xA3) * 256;
            b = i2cread_color(0x43, 0xA4) + i2cread_color(0x43, 0xA5) * 256;

            r *= 1.3 * 0.47 * 0.83
            g *= 0.69 * 0.56 * 0.83
            b *= 0.80 * 0.415 * 0.83
            c *= 0.3

            if (r > b && r > g) {
                b *= 1.18;
                g *= 0.95
            }

            temp_c = c
            temp_r = r
            temp_g = g
            temp_b = b

            r = Math.min(r, 4095.9356)
            g = Math.min(g, 4095.9356)
            b = Math.min(b, 4095.9356)
            c = Math.min(c, 4095.9356)

            if (temp_b < temp_g) {
                temp = temp_b
                temp_b = temp_g
                temp_g = temp
            }
        }
        else {
            if (color_first_init == false) {
                initModule()
                colorMode()
            }
            let tmp = i2cread_color(APDS9960_ADDR, APDS9960_STATUS) & 0x1;
            while (!tmp) {
                basic.pause(5);
                tmp = i2cread_color(APDS9960_ADDR, APDS9960_STATUS) & 0x1;
            }
            c = i2cread_color(APDS9960_ADDR, APDS9960_CDATAL) + i2cread_color(APDS9960_ADDR, APDS9960_CDATAH) * 256;
            r = i2cread_color(APDS9960_ADDR, APDS9960_RDATAL) + i2cread_color(APDS9960_ADDR, APDS9960_RDATAH) * 256;
            g = i2cread_color(APDS9960_ADDR, APDS9960_GDATAL) + i2cread_color(APDS9960_ADDR, APDS9960_GDATAH) * 256;
            b = i2cread_color(APDS9960_ADDR, APDS9960_BDATAL) + i2cread_color(APDS9960_ADDR, APDS9960_BDATAH) * 256;
        }

        serial.writeNumber(r)
        serial.writeLine("r")
        serial.writeNumber(g)
        serial.writeLine("g")
        serial.writeNumber(b)
        serial.writeLine("b")
        serial.writeNumber(c)
        serial.writeLine("c")

        // map to rgb based on clear channel
        let avg = c / 3;
        r = r * 255 / avg;
        g = g * 255 / avg;
        b = b * 255 / avg;
        //let hue = rgb2hue(r, g, b);
        let hue = rgb2hsl(r, g, b)
        if (color_new_init == true && hue >= 180 && hue <= 201 && temp_c >= 6000 && (temp_b - temp_g) < 1000 || (temp_r > 4096 && temp_g > 4096 && temp_b > 4096)) {
            temp_c = Math.map(temp_c, 0, 15000, 0, 13000);
            hue = 180 + (13000 - temp_c) / 1000.0;
        }
        return hue
    }
    //% block="Color sensor IIC port detects %color"
    //% subcategory=ColorSensor group="IIC Port"
    //% color.fieldEditor="gridpicker" color.fieldOptions.columns=3
    export function checkColor(color: ColorList): boolean {
        let hue = readColor()
        switch (color) {
            case ColorList.red:
                if (hue > 330 || hue < 20) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.green:
                if (hue > 120 && 180 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.blue:
                if (hue > 210 && 270 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.cyan:
                if (hue > 190 && 210 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.magenta:
                if (hue > 260 && 330 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.yellow:
                if (hue > 30 && 120 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
            case ColorList.white:
                if (hue >= 180 && 190 > hue) {
                    return true
                }
                else {
                    return false
                }
                break
        }
    }


}
