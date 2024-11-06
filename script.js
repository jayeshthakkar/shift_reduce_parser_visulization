document.getElementById('parseBtn').addEventListener('click', () => {
    const grammar = document.getElementById('grammar').value;
    const input = document.getElementById('input').value;

    const parsingSteps = parseInput(input);
    displaySteps(parsingSteps);
});

function parseInput(input) {
    const steps = [];
    const stack = [];
    let buffer = input.split(' ').filter(token => token); // Split input into tokens

    // Simulated grammar rules
    const grammarRules = {
        'E': ['E + E', 'E * E', 'id'],
    };

    while (buffer.length > 0 || stack.length > 0) {
        // Shift action
        if (buffer.length > 0) {
            stack.push(buffer.shift());
            steps.push({ stack: stack.join(' '), input: buffer.join(' '), action: 'Shift' });
        }

        // Simple reduction logic
        let reduced = false;
        for (const [nonTerminal, productions] of Object.entries(grammarRules)) {
            for (const production of productions) {
                const productionArray = production.split(' ');
                if (stack.slice(-productionArray.length).join(' ') === production) {
                    stack.splice(-productionArray.length); // Reduce the last tokens
                    stack.push(nonTerminal); // Push the non-terminal
                    steps.push({ stack: stack.join(' '), input: buffer.join(' '), action: `Reduce to ${nonTerminal}` });
                    reduced = true;
                    break;
                }
            }
            if (reduced) break;
        }

        // If no reduction is possible and the buffer is empty, we are done
        if (!reduced && buffer.length === 0) {
            break;
        }
    }

    return steps;
}

function displaySteps(steps) {
    const stepsTable = document.getElementById('steps');
    stepsTable.innerHTML = ''; // Clear previous steps

    steps.forEach(step => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${step.stack}</td><td>${step.input}</td><td>${step.action}</td>`;
        stepsTable.appendChild(row);
    });
}