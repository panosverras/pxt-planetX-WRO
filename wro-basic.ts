
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


    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    //% channel.fieldEditor="gridpicker" channel.fieldOptions.columns=4
    //% subcategory=Sensor group="IIC Port"
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


}
