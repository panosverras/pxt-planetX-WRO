
/**
* Use this file to define custom functions and blocks.
* Read more at https://makecode.microbit.org/blocks/custom
*/


/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon=""
namespace PlanetX_WRO {
    

    /**
    * Gets the position offset.The range is from -3000 to 3000.
    */
    //% sensor_number.fieldEditor="gridpicker" sensor_number.fieldOptions.columns=2
    //% subcategory=Sensor group="IIC Port"
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


}
