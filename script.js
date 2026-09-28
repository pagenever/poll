const API_URL =
"https://script.google.com/macros/s/AKfycbz4SoR6KgBSkvId3kS11_ryDiLOgshFO0r5wvDKzjOuGwACBFF9nOmwmP_b7MMkz_4lpA/exec";


const POLL_ID =
"YANIV-POLL-001";


document
.getElementById("pollForm")
.addEventListener("submit", async function(e) {

    e.preventDefault();

    const selected =
        document.querySelector(
            'input[name="poll"]:checked'
        );

    if (!selected) {

        showMessage(
            "Please select an option."
        );

        return;
    }


    let voterId =
        localStorage.getItem("yanivVoterId");


    if (!voterId) {

        voterId =
            crypto.randomUUID();

        localStorage.setItem(
            "yanivVoterId",
            voterId
        );
    }


    const data = {

        pollId: POLL_ID,

        option: selected.value,

        voterId: voterId

    };


    try {

        showMessage(
            "Submitting vote..."
        );


        const response =
            await fetch(API_URL, {

                method: "POST",

                body:
                    JSON.stringify(data)

            });


        const result =
            await response.json();


        if (result.success) {

            showMessage(
                "Vote submitted successfully."
            );

            document
            .getElementById("pollForm")
            .reset();

        } else {

            showMessage(
                result.message
            );

        }

    } catch (error) {

        showMessage(
            "Unable to submit vote."
        );

    }

});


function showMessage(message) {

    document
    .getElementById("message")
    .innerText = message;

}


async function showResults() {

    const resultsBox =
        document.getElementById(
            "results"
        );


    resultsBox.innerHTML =
        "Loading results...";


    try {

        const response =
            await fetch(API_URL);


        const data =
            await response.json();


        const results =
            data.results;


        let total = 0;


        Object.values(results)
        .forEach(value => {

            total += value;

        });


        if (total === 0) {

            resultsBox.innerHTML =
                "No votes yet.";

            return;

        }


        let html = "";


        Object.entries(results)
        .forEach(([option, votes]) => {

            const percentage =
                ((votes / total) * 100)
                .toFixed(1);


            html += `

                <div class="result-row">

                    <div class="result-title">

                        <span>
                            ${option}
                        </span>

                        <strong>
                            ${percentage}%
                        </strong>

                    </div>

                    <div class="bar">

                        <div
                            class="bar-fill"
                            style="
                            width:${percentage}%
                            ">
                        </div>

                    </div>

                    <small>
                        ${votes} votes
                    </small>

                </div>

            `;

        });


        resultsBox.innerHTML = html;


    } catch(error) {

        resultsBox.innerHTML =
            "Unable to load results.";

    }

}