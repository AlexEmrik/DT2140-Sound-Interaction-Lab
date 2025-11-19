//==========================================================================================
// AUDIO SETUP
//------------------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------------------
// Edit just where you're asked to!
//------------------------------------------------------------------------------------------
//
//==========================================================================================
let dspNode = null;
let dspNodeParams = null;
let jsonParams = null;

// Change here to ("tuono") depending on your wasm file name
const dspName = "wind";
const instance = new FaustWasm2ScriptProcessor(dspName);

// output to window or npm package module
if (typeof module === "undefined") {
    window[dspName] = instance;
} else {
    const exp = {};
    exp[dspName] = instance;
    module.exports = exp;
}

// The name should be the same as the WASM file, so change tuono with brass if you use brass.wasm
wind.createDSP(audioContext, 1024)
    .then(node => {
        dspNode = node;
        dspNode.connect(audioContext.destination);
        console.log('params: ', dspNode.getParams());
        const jsonString = dspNode.getJSON();
        jsonParams = JSON.parse(jsonString)["ui"][0]["items"];
        dspNodeParams = jsonParams
        // const exampleMinMaxParam = findByAddress(dspNodeParams, "/thunder/rumble");
        // // ALWAYS PAY ATTENTION TO MIN AND MAX, ELSE YOU MAY GET REALLY HIGH VOLUMES FROM YOUR SPEAKERS
        // const [exampleMinValue, exampleMaxValue] = getParamMinMax(exampleMinMaxParam);
        // console.log('Min value:', exampleMinValue, 'Max value:', exampleMaxValue);
    });


//==========================================================================================
// INTERACTIONS
//------------------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------------------
// Edit the next functions to create interactions
// Decide which parameters you're using and then use playAudio to play the Audio
//------------------------------------------------------------------------------------------
//
//==========================================================================================

// /wind/volume
// /wind/wind/force

let smoothedForce = 0;     
const MAX_FORCE = 1.0;     
const SMOOTHING = 0.15;    
const SENSITIVITY = 2000.0;
const BASE_FORCE = 0.0;    

function accelerationChange(accx, accy, accz) {

    const total = Math.sqrt(accx * accx + accy * accy + accz * accz);

    const extra = Math.max(0, total - 9.8);

    let targetForce = extra / SENSITIVITY;

    if (targetForce > MAX_FORCE) targetForce = MAX_FORCE;
    if (targetForce < 0) targetForce = 0;

    smoothedForce = smoothedForce + SMOOTHING * (targetForce - smoothedForce);

    const finalForce = BASE_FORCE + (1.0 - BASE_FORCE) * smoothedForce;

    dspNode.setParamValue("/wind/wind/force", finalForce);
}

function rotationChange(rotx, roty, rotz) {

}

function mousePressed() {
    //playAudio(mouseX/windowWidth)
    // Use this for debugging from the desktop!
}

function deviceMoved() {
    movetimer = millis();
    statusLabels[2].style("color", "pink");
}

function deviceTurned() {
    threshVals[1] = turnAxis;
}
function deviceShaken() {
    shaketimer = millis();
    statusLabels[0].style("color", "pink");
    playAudio();
}

function getMinMaxParam(address) {
    const exampleMinMaxParam = findByAddress(dspNodeParams, address);
    // ALWAYS PAY ATTENTION TO MIN AND MAX, ELSE YOU MAY GET REALLY HIGH VOLUMES FROM YOUR SPEAKERS
    const [exampleMinValue, exampleMaxValue] = getParamMinMax(exampleMinMaxParam);
    console.log('Min value:', exampleMinValue, 'Max value:', exampleMaxValue);
    return [exampleMinValue, exampleMaxValue]
}

//==========================================================================================
// AUDIO INTERACTION
//------------------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------------------
// Edit here to define your audio controls 
//------------------------------------------------------------------------------------------
//
//==========================================================================================

//function playAudio(pressure) {
//    if (!dspNode) {
//        return;
//    }
//    if (audioContext.state === 'suspended') {
//        return;
//    }
//    console.log(pressure)
//    dspNode.setParamValue("/brass/blower/pressure", pressure)
//}

//==========================================================================================
// END
//==========================================================================================