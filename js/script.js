const dataResult = document.getElementById("dataResult");
const dataDetails = document.getElementById("dataDetails");
const file = document.getElementById("file");
const btnFile = document.getElementById("btnFile");


var cutList = [];
var copyCutList = [];

//espesor de corte
var thickness = 0.5;

var cutResult = [];

//resultados
var totalGroup = 0;
var totalResto = 0;
var totalMetros = 0;
var totalMilim = 0;
var porcentResto = 0;

function reset() {
    cutList = [];
    copyCutList = [];
    cutResult = [];
    totalGroup = 0;
    totalResto = 0;
    totalMetros = 0;
    totalMilim = 0;
    porcentResto = 0;
    dataResult.innerHTML = "";
    dataDetails.innerHTML = "";
}

file.addEventListener("change", () => {
    reset();
  importExcel();
});


btnFile.addEventListener("click", () => {

    
    if (file.value == "") {
        dataDetails.innerHTML = "Debe ingresar un archivo";
    } else {
        
        sortCutList();
        
    while (cutList.length > 0) {
      groupCuts();
    }
    
    calcResult();
    
    insertHtml();
    
    
}
});

function importExcel() {
    cutList = [];
    readXlsxFile(file.files[0]).then(function (data) {
        for (i in data) {
            for (j = 0; j < data[i][0]; j++) {
                cutList.push(data[i][1]);
                copyCutList.push(data[i][1]);
            }
        }

  });
}

function sortCutList() {
  cutList.sort(function (a, b) {
    return b - a;
  });

}

function groupCuts() {
  var groupCut = [];
  var maxWidth = 6000;
  var spliceCut = [];

  for (i in cutList) {
    if (cutList[i] <= maxWidth) {
      groupCut.push(cutList[i]);
      maxWidth -= cutList[i];
      if (maxWidth > 0) {
        maxWidth -= thickness;
      }
      spliceCut.push(i);
    }
  }
  if (groupCut.length > 0) {
    currentGroup = {
      cortes: groupCut,
      resto: maxWidth,
    };

    cutResult.push(currentGroup);
  }

  //oredenar los cortes a borrar de mayor a menor
  //esto es porque sino se borra el primer corte y se modifican los index de los proximos cortes
  spliceCut.sort(function (a, b) {
    return b - a;
  });
  for (i in spliceCut) {
    cutList.splice(spliceCut[i], 1);
  }
}

function calcResult() {
  //resultados

  totalGroup = cutResult.length;

  totalResto = cutResult.reduce(function (a, b) {
    return a + b.resto;
  }, 0);

  totalMetros = totalGroup * 6;

  totalMilim = totalMetros * 1000;

  porcentResto = Math.round(((totalResto * 100) / totalMilim) * 100) / 100;

    
    
}

function insertHtml() {
    dataDetails.innerHTML = `
   
    <ul>
    <li>
    <h3>Detalle</h3>
    </li>
    <li>
    <p><b>Total perfiles: </b>${totalGroup}</p>
    </li>
    <li>
    <p><b>Total metros: </b>${totalMetros} m</p>
    </li>
    <li >
    <p><b>Resto final: </b>${totalResto} mm</p>
    </li>
    <li>
    <p><b>Desperdicio: </b>${porcentResto}%</p>
    </li>
    </ul>
    `;

    //insert copy cut list
    dataResult.innerHTML = `

    <div class="row">
    <div class="col-md-12">
    <h3>Lista de cortes:</h3>
    <p>${copyCutList.join(' - ')}</p>
    <br>

    <table class="table">
    <thead>
        <tr>
        <th scope="col">#</th>
        <th scope="col">Cortes (mm)</th>
        <th scope="col">Resto (mm)</th>
        </tr>
    </thead>
     <tbody>
          ${cutResult
            .map(
              (group, index) => `
            <tr>
              <th scope="row">${index + 1}</th>
              <td>${group.cortes.join(", ")}</td>
              <td>${group.resto}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
    </table>
    `;
}



