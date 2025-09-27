let Rspeed = 0
let Lspeed = 0
let PD = 0
nezhaV2_WRO.setComboMotor(nezhaV2_WRO.MotorPostion.M1, nezhaV2_WRO.MotorPostion.M4)
nezhaV2_WRO.resetRelAngleValue(nezhaV2_WRO.MotorPostion.M1)
let Kp = 0.07
let Kd = 0.09
let previousError = 0
let currentError = 0
let baseSpeed = 60
while (nezhaV2_WRO.readRelAngle(nezhaV2_WRO.MotorPostion.M1) < 300) {
    currentError = PlanetX_WRO.TrackBit_get_offset()
    PD = Kp * currentError + Kd * (currentError - previousError)
    Lspeed = nezhaV2_WRO.limitToFloor(baseSpeed + PD, nezhaV2_WRO.FloorLimit.min, 0)
    Rspeed = nezhaV2_WRO.limitToFloor(baseSpeed - PD, nezhaV2_WRO.FloorLimit.min, 0)
    nezhaV2_WRO.start(nezhaV2_WRO.MotorPostion.M1, Lspeed)
    nezhaV2_WRO.start(nezhaV2_WRO.MotorPostion.M4, Rspeed)
}
basic.forever(function () {
	
})
