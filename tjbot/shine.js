/***************************************************************************
* Copyright 2017 IBM
*
*   TJBot Nodes for Node-RED
*
*   By JeanCarl Bisson (@dothewww)
*   More info: https://ibm.biz/node-red-contrib-tjbot
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
****************************************************************************/

var tj = require("./tjbot.js");
var LED_R = new Gpio(16, 'out');
var LED_G = new Gpio(20, 'out');
var LED_B = new Gpio(21, 'out');

module.exports = function(RED) {

  function blinkLED(var ctlLED) { //function to start blinking
	var LED = ctlLED;
	if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
		LED.writeSync(1); //set pin state to 1 (turn LED on)
	} else {
		LED.writeSync(0); //set pin state to 0 (turn LED off)
	}
  }

  function TJBotNodeShine(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    tj.bots[config.botId].shine("off");

    node.on("input", function(msg) {
      var color = msg.color||config.color;
      var duration = parseFloat(msg.duration||config.duration);
      var mode = msg.mode||config.mode;

      switch(mode.toLowerCase()) {
        case "shine":
		  switch(color){
			case "red":
				LED_R.writeSync(1);
				LED_G.writeSync(0);
				LED_B.writeSync(0);
				break;

			case "green":
				LED_R.writeSync(0);
				LED_G.writeSync(1);
				LED_B.writeSync(0);
				break;

			case "blue":
				LED_R.writeSync(0);
				LED_G.writeSync(0);
				LED_B.writeSync(1);
				break

			case "off":
				LED_R.writeSync(0);
				LED_G.writeSync(0);
				LED_B.writeSync(0);

				// Unexport GPIO to free resources
				LED_R.unexport();
				LED_G.unexport();
				LED_B.unexport();

				break;

			default:
				break;
        break;
        case "pulse":
		  switch(color)
		  {
			case "red":
				setInterval(blinkLED(LED_R), duration);
				break;

			case "green":
				setInterval(blinkLED(LED_G), duration);
				break;

			case "blue":
				setInterval(blinkLED(LED_B), duration);
				break;

			default;
				break;
		  }
        break;
      }

    });
  }

  function
  RED.nodes.registerType("tjbot-shine", TJBotNodeShine);
}
