import inquirer from 'inquirer';
import chalk from 'chalk';
import os from 'os';
import fs from 'fs-extra';
import path from 'path';


let operatingSystem = os.platform();
let currentDate = new Date();
let currentTime = currentDate.toLocaleTimeString();

const questions = [
    // question name
    {
        type: "input",
        name: "name",
        message: chalk.green("What's your name?"),
        validate: (answer) => {
            if(answer === ''){
                return 'pls enter a valid name!';
            }
            return true;
        }
    },
    // questions height
    {
      	type: "input",
        name: "height",
        message: chalk.green("What's your height (in cm) ?"),
        validate: (answer) => {
            if( isNaN(answer) ){
                return 'pls enter a valid number!';
            }
            return true;
        }
    },
    // questions weight
    {
        type: "input",
      name: "weight",
      message: chalk.green("What's your weight (in kg) ?"),
      validate: (answer) => {
          if( isNaN(answer) ){
              return 'pls enter a valid number!';
          }
          return true;
      }
    },
    {
        type: "input",
        name: "saveToFile",
        message: chalk.green("Möchten Sie das Ergebnis in einer Datei speichern? [Ja|Nein]: "),
        default: false, // Optional: Setze den Standardwert auf false (Nein)
        validate: (answer) => {
            if (answer.toLowerCase() !== 'ja' && answer.toLowerCase() !== 'nein') {
                return 'Bitte geben Sie nur "Ja" oder "Nein" ein!';
            }
            return true;
        }
    }    
]


function calc_bmi(gewicht, groesser){
    const height = groesser/100;
    const bmi = gewicht/(height*height);
    return bmi.toFixed(2);
}

function eval_bmi(bmi){

    console.log('*********************************');
    console.log("BMI: ",bmi);
    console.log('*********************************');
    
    if(bmi < 18.5){
        console.log(chalk.bgWhite.yellow.bold("Untergewicht"))
    }
    if(bmi >= 18.5 && bmi < 25){
        console.log(chalk.bgWhite.blue.bold("Normalgewicht"))
    }
    if(bmi >= 25 && bmi < 30 ){
        console.log(chalk.bgWhite.cyanBright.bold("Uebergewicht"))
    }
    if(bmi > 30){
        console.log(chalk.bgWhite.red.bold("Adipositas"))
    }
}

function save_data(answer,bmi){

    const fileName = answer.name;

    // JSON object as a string
    const answerString = JSON.stringify(answer);

    // Parse the JSON string into a JavaScript object
    const jsonObject = JSON.parse(answerString);

    // Add a new property to the JavaScript object
    jsonObject.bmi = bmi;

    // Create the file path using the current directory
    const filePath = path.join("./", fileName);

    // Schreibe das Ergebnis in die Datei
    fs.writeFile(filePath, JSON.stringify(jsonObject), (err) => {
    if (err) {
        console.error('Fehler beim Schreiben der Datei:', err);
    } else {
        console.log(`Das Ergebnis wurde erfolgreich in die Datei ${fileName} geschrieben.`);
    }
    });
}



console.log("------------------------------------");
console.log(chalk.greenBright.bold("Sie benutzen: ",operatingSystem,"====> System Zeit: ", currentTime));

console.log(chalk.bgWhite.bold.red('--------------------------- BMI Rechner ---------------------------'));

inquirer
  .prompt(questions)
  .then((answers) => {
    //console.log(JSON.stringify(answers, null, 2))
    const kg = parseFloat(answers.weight);
    const cm = parseFloat(answers.height);
    const bmi = calc_bmi(kg, cm);
    eval_bmi(bmi);
    //eval_bmi(calc_bmi(parseFloat(answers.weight), parseFloat(answers.height)));
    if(answers.saveToFile.toLowerCase() === 'nein'){
        process.exit(0);
    }
    save_data(answers,bmi);
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log("Your console environment is not supported!")
    } else {
      console.log(error)
    }
})