let previousError = 0
let currentError = 0
let baseSpeed = 0
let mSpeed = 0
basic.forever(function () {
    nezhaV2_WRO.resetRelAngleValue(nezhaV2_WRO.MotorPostion.M1)
    previousError = 0
    currentError = 0
    baseSpeed = 50
    while (nezhaV2_WRO.readRelAngle(nezhaV2_WRO.MotorPostion.M1) < 300) {
        currentError = PlanetX_WRO.TrackBit_get_offset()
        mSpeed = nezhaV2_WRO.pd_calculator(
        0.07,
        0,
        0,
        0
        )
    }
})
