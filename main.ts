let Rspeed = 0
let Lspeed = 0
let mSpeed = 0
nezhaV2_WRO.resetRelAngleValue(nezhaV2_WRO.MotorPostion.M1)
let Kp = 0.07
let Kd = 0.09
let previousError = 0
let currentError = 0
let baseSpeed = 60
while (nezhaV2_WRO.readRelAngle(nezhaV2_WRO.MotorPostion.M1) < 300) {
    currentError = PlanetX_WRO.TrackBit_get_offset()
    mSpeed = Kp * currentError + Kd * (currentError - previousError)
    Lspeed = 0
    Rspeed = 0
}
basic.forever(function () {
	
})
