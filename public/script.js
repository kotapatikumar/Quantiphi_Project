const API =
"http://localhost:5000/api/subscriptions";


// Load All Subscriptions

async function loadSubscriptions() {

    try {

        const response =
            await fetch(API);

        const data =
            await response.json();

        renderTable(data);

        calculateMetrics(data);

    }

    catch(error){

        console.log(error);

    }

}


// Add Subscription

async function addSubscription() {

    const serviceName =
        document.getElementById(
            "serviceName"
        ).value;

    const cost =
        document.getElementById(
            "cost"
        ).value;

    const billingCycle =
        document.getElementById(
            "billingCycle"
        ).value;

    const renewalDate =
        document.getElementById(
            "renewalDate"
        ).value;

    if(
        !serviceName ||
        !cost ||
        !renewalDate
    ){
        alert("Fill all fields");
        return;
    }

    try {

        await fetch(API, {

            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                serviceName,
                cost,
                billingCycle,
                renewalDate

            })

        });

        document.getElementById(
            "serviceName"
        ).value = "";

        document.getElementById(
            "cost"
        ).value = "";

        document.getElementById(
            "renewalDate"
        ).value = "";

        loadSubscriptions();

    }

    catch(error){

        console.log(error);

    }

}


// Render Table

function renderTable(data){

    const tbody =
        document.getElementById(
            "tableBody"
        );

    tbody.innerHTML = "";

    data.forEach(sub => {

        const row =
            document.createElement("tr");

        if(
            sub.status === "Paused"
        ){
            row.classList.add(
                "paused"
            );
        }

        const today =
            new Date();

        const renewal =
            new Date(
                sub.renewalDate
            );

        const days =
            Math.ceil(
                (renewal - today)
                /
                (1000*60*60*24)
            );

        let badge = "";

        if(
            days >= 0 &&
            days <= 7
        ){

            badge =
            `<span class="soon">
                Renewing Soon
             </span>`;

        }

        row.innerHTML = `

        <td>
            ${sub.serviceName}
        </td>

        <td>
            ₹${sub.cost}
        </td>

        <td>
            ${sub.billingCycle}
        </td>

        <td>
            ${renewal.toLocaleDateString()}
            ${badge}
        </td>

        <td>

            <button

            class="${
                sub.status === "Active"
                ?
                "active-btn"
                :
                "paused-btn"
            }"

            onclick="toggleStatus(
                '${sub._id}'
            )">

            ${sub.status}

            </button>

        </td>

        `;

        tbody.appendChild(row);

    });

}


// Toggle Status

async function toggleStatus(id){

    try {

        await fetch(

            `${API}/${id}`,

            {
                method:"PUT"
            }

        );

        loadSubscriptions();

    }

    catch(error){

        console.log(error);

    }

}


// Calculate Metrics

function calculateMetrics(data){

    let burnRate = 0;

    let renewals = 0;

    const today =
        new Date();

    data.forEach(sub => {

        if(
            sub.status === "Active"
        ){

            if(
                sub.billingCycle === "Yearly"
            ){

                burnRate +=
                    Number(sub.cost) / 12;

            }

            else{

                burnRate +=
                    Number(sub.cost);

            }

        }

        const renewal =
            new Date(
                sub.renewalDate
            );

        const days =
            Math.ceil(
                (renewal - today)
                /
                (1000*60*60*24)
            );

        if(
            days >= 0 &&
            days <= 7
        ){

            renewals++;

        }

    });

    document.getElementById(
        "burnRate"
    ).innerText =
    "₹" +
    burnRate.toFixed(2);

    document.getElementById(
        "renewals"
    ).innerText =
    renewals;
}


// Initial Load

loadSubscriptions();