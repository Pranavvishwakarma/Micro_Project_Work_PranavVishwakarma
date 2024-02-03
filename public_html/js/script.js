/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpbdIML = '/api/iml';
var studentDatabaseName = 'SCHOOL-DB';
var studentRelationName = 'STUDENT-TABLE1';
var connectionToken = '90931765|-31949307490351981|90963433';

$('#rollNo').focus();

function alertHandlerHTML(status, message) {
  
    
    if (status === 1) {
        return `<div class="alert  alert-primary d-flex align-items-center alert-dismissible " role="alert">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:"><use xlink:href="#info-fill"/></svg>
                <div>
                  <strong>Success!</strong> ${message}
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>`;
    } else {
        return `<div class="alert  alert-warning d-flex align-items-center alert-dismissible" role="alert">
        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
        <div>
          <strong>Warning!</strong> ${message}
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    }

}

////Function for append alter message into alter div
function alertHandler(status, message) {
    var alterHTML = alertHandlerHTML(status, message);
    let alertDiv = document.createElement('div');
    alertDiv.innerHTML = alterHTML;
    $('#disposalAlertContainer').append(alertDiv);
}


function saveRecNoToLocalStorage(jsonObject) {
    var lvData = JSON.parse(jsonObject.data);
    localStorage.setItem('recordNo', lvData.rec_no);
}


function disableAllFeildExceptRollno() {
    $('#fullName').prop('disabled', true);
    $('#class').prop('disabled', true);
    $('#birthDate').prop('disabled', true);
    $('#inputAddress').prop('disabled', true);
    $('#enrollmentDate').prop('disabled', true);
    $('#resetBtn').prop('disabled', true);
    $('#saveBtn').prop('disabled', true);
    $('#updateBtn').prop('disabled', true);
}

function resetForm() {
    $('#rollNo').val("");
    $('#fullName').val("");
    $('#class').val("");
    $('#birthDate').val("");
    $('#inputAddress').val("");
    $('#enrollmentDate').val("");

    $('#rollNo').prop('disabled', false);
    disableAllFeildExceptRollno();
    $('#rollNo').focus();


}

function fillData(jsonObject) {
    if (jsonObject === "") {
        $('#fullName').val("");
        $('#class').val("");
        $('#birthDate').val("");
        $('#inputAddress').val("");
        $('#enrollmentDate').val("");
    } else {
        
        saveRecNoToLocalStorage(jsonObject);
        
        // parse json object into JSON
        var data = JSON.parse(jsonObject.data).record;
        
        $('#fullName').val(data.name);
        $('#class').val(data.className);
        $('#birthDate').val(data.birthDate);
        $('#inputAddress').val(data.address);
        $('#enrollmentDate').val(data.enrollmentData);
    }
}



function validateEnrollmentDate() {
    var inputBirthDate = $('#birthDate').val();
    var inputEnrollmentDate = $('#enrollmentDate').val();
    inputBirthDate = new Date(inputBirthDate);
    inputEnrollmentDate = new Date(inputEnrollmentDate);
    
    
    return inputBirthDate.getTime() < inputEnrollmentDate.getTime();

}

function validateFormData() {
    var rollNo, name, className, birthDate, address, enrollmentData;
    rollNo = $('#rollNo').val();
    name = $('#fullName').val();
    className = $('#class').val();
    birthDate = $('#birthDate').val();
    address = $('#inputAddress').val();
    enrollmentData = $('#enrollmentDate').val();

    if (rollNo === '') {
        alertHandler(0, 'Roll NO Missing');
        $('#rollNo').focus();
        return "";
    }

    if (rollNo <= 0) {
        alertHandler(0, 'Invalid Roll-No');
        $('#rollNo').focus();
        return "";
    }

    if (className === '') {
        alertHandler(0, 'Class Name is Missing');
        $('#class').focus();
        return "";
    }
    if (className <= 0 && className > 12) {
        alertHandler(0, 'Invalid Class Name');
        $('#class').focus();
        return "";
    }
    if (birthDate === '') {
        alertHandler(0, 'Birth Date Is Missing');
        $('#birthDate').focus();
        return "";
    }
    if (address === '') {
        alertHandler(0, 'Address Is Missing');
        $('#address').focus();
        return "";
    }
    if (enrollmentData === '') {
        alertHandler(0, 'Enrollment Data Is Missing');
        $('#enrollmentDate').focus();
        return "";
    }

    if (!validateEnrollmentDate()) {
        alertHandler(0, 'Invalid Enrollment Date(i.e Enrollment Date should be greater than Birth Date)');
        $('#enrollmentData').focus();
        return "";
    }

    
    var jsonStrObj = {
        id: rollNo,
        name: name,
        className: className,
        birthDate: birthDate,
        address: address,
        enrollmentData: enrollmentData
    };
    
    //Convert JSON object into string 
    return JSON.stringify(jsonStrObj);
}



function getStudentRollnoAsJsonObj() {
    var rollNO = $('#rollNo').val();
    var jsonStr = {
        id: rollNO
    };
    return JSON.stringify(jsonStr);
}


function getStudentData() {

     
    if ($('#rollNo').val() === "") { 
        disableAllFeildExceptRollno();
    } else if ($('#rollNo').val() < 1) {
        disableAllFeildExceptRollno();
        alertHandler(0, 'Invalid Roll-No');
        $('#rollNo').focus();
    } else { 
        var studentRollnoJsonObj = getStudentRollnoAsJsonObj(); 
        
        
        var getRequest = createGET_BY_KEYRequest(connectionToken, studentDatabaseName, studentRelationName, studentRollnoJsonObj);
        
        jQuery.ajaxSetup({async: false});
       
        var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
        jQuery.ajaxSetup({async: true});
        
        // Enable all feild
        $('#rollNo').prop('disabled', false);
        $('#fullName').prop('disabled', false);
        $('#class').prop('disabled', false);
        $('#birthDate').prop('disabled', false);
        $('#inputAddress').prop('disabled', false);
        $('#enrollmentDate').prop('disabled', false);

        
        if (resJsonObj.status === 400) { 
            $('#resetBtn').prop('disabled', false);
            $('#saveBtn').prop('disabled', false);
            $('#updateBtn').prop('disabled', true);
            fillData("");
            $('#name').focus();
        } else if (resJsonObj.status === 200) {
            $('#rollNO').prop('disabled', true);
            fillData(resJsonObj);
            $('#resetBtn').prop('disabled', false);
            $('#updateBtn').prop('disabled', false);
            $('#saveBtn').prop('disabled', true);
            $('#name').focus();
        }
    }



}

//Function to make PUT request to save data into database
function saveData() {
    var jsonStrObj = validateFormData();
    
    // If form data is not valid
    if (jsonStrObj === '')
        return '';

    // create PUT Request object
    var putRequest = createPUTRequest(connectionToken, jsonStrObj, studentDatabaseName, studentRelationName);
    jQuery.ajaxSetup({async: false});
    
    //Make PUT Request for saving data into database
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpbdIML);
    jQuery.ajaxSetup({async: true});
    
    if (resJsonObj.status === 400) {// If data is not saved
        alertHandler(0, 'Data Is Not Saved ( Message: ' + resJsonObj.message + " )");
    } else if (resJsonObj.status === 200) {// If data is successfully saved
        alertHandler(1, 'Data Saved successfully');
    }
    //After saving to databse resent from data 
    resetForm();
    
    $('#empid').focus();
}




function changeData() {
    $('#changeBtn').prop('disabled', true);
    var jsonChg = validateFormData();
    

    var updateRequest = createUPDATERecordRequest(connectionToken, jsonChg, studentDatabaseName, studentRelationName, localStorage.getItem("recordNo"));
    jQuery.ajaxSetup({async: false});
    
 
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpbdIML);
    jQuery.ajaxSetup({async: true});
    
    if (resJsonObj.status === 400) {
        alertHandler(0, 'Data Is Not Update ( Message: ' + resJsonObj.message + " )");
    } else if (resJsonObj.status === 200) {// If data is successfully saved
        alertHandler(1, 'Data Update successfully');
    }
    
   
    resetForm();
    $('#empid').focus();
}

