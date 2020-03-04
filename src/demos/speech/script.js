import * as speechCommands from '@tensorflow-models/speech-commands';

const MODEL_PATH = 'http://127.0.0.1:8080/speech';

window.onload = async () => {
    const recognizer = speechCommands.create(
        'BROWSER_FFT',
        null,
        MODEL_PATH + '/model.json',
        MODEL_PATH + '/metadata.json'
    );

    await recognizer.ensureModelLoaded();

    const labels = recognizer.wordLabels().slice(2);
    const resultEl = document.querySelector('#result');
    resultEl.innerHTML = labels.map(l => `
        <div>${l}</div>
    `).join('');
    recognizer.listen(result => {
        const { scores } = result;
        const maxValue = Math.max(...scores);
        const index = scores.indexOf(maxValue) - 2;
        resultEl.innerHTML = labels.map((l, i) => `
        <div style="background: ${i === index && 'green'}">${l}</div>
        `).join('');
    }, {
        overlapFactor: 0.3,
        probabilityThreshold: 0.9
    });
};