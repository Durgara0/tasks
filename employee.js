		var url = window.location.href;
		var UIcontroller=(function(){
			var details;
			var DOM={
				home : document.querySelector('.container'),
				empNodeList: document.querySelectorAll('.emp'),
				updateButton:document.querySelector('.button'),
				popup : document.querySelector('.popup'),
				addPopup:document.querySelector('#popup-add'),
				cancelPopup:document.querySelector('#popup-cancel'),
				empId:document.querySelector('input[name="id"]'),
				empName:document.querySelector('input[name="name"]'),
				empAge:document.querySelector('input[name="age"]'),
				empSalary:document.querySelector('input[name="salary"]'),
				spanPopup:document.querySelector('.close'),	
				errorMsg:document.querySelector('.empError'),
				}
			var updateFormFields=function(){
				DOM.empId.value=details.id;
				DOM.empName.value=details.employee_name;
				DOM.empAge.value=details.employee_age;
				DOM.empSalary.value=details.employee_salary;
			} 
			var updateDetails=function(){
				var empArray=Array.from(DOM.empNodeList);
				empArray.forEach(cur=>{
					var classListArray=Array.from(cur.classList);
					cur.textContent=details[classListArray[1]];
				});
			}
			var nameValidation=function(name){
				var exp;
				exp=/^[a-zA-Z]+(\s[a-zA-Z]+)?$/;
				if(!name.match(exp)){
					DOM.errorMsg.innerHTML='Only letters are allowed in name';
					return 0;
				}
				return 1;	
			}
			var numberValidation=function(num){
				var exp;
				exp=/[^0-9]/;
				if(num.match(exp)){
					return 0;
				}	
				return 1;
			}
			var ageValidation=function(age){
				if(!numberValidation(age)){
					DOM.errorMsg.innerHTML='enter valid age';
					return 0;
				}
				else if(age<18){
					DOM.errorMsg.innerHTML='age must be grater the 18';
					return 0;
				}
				else{
					return 1;
				}
			}
			var salaryValidation=function(salary){
				if(!numberValidation(salary)){
					DOM.errorMsg.innerHTML='enter valid salary';
					return 0;
				}
				return 1;
			}
			var dataValidation=function(data){
				var a=0;
				DOM.errorMsg.style.visibility='visible';
				if(data.employee_name && data.employee_age && data.employee_salary){
					a=nameValidation(data.employee_name);
					a&=ageValidation(data.employee_age);
					a&=salaryValidation(data.employee_salary);
				}
				else{
					DOM.errorMsg.innerHTML='enter valid Details';
				}
				return a;
			}			
			return{
				getURLparameters: function (url) {
					var parser,query,vars,pair,parameters = {};
					parser = document.createElement('a');
						parser.href = url;
					query = parser.search.substring(1);
					vars = query.split('&');
					for (var i = 0; i < vars.length; i++) {
						pair = vars[i].split('=');
						parameters[pair[0]] = decodeURIComponent(pair[1]);
					}
					return parameters.id;
				},
				showDetails: function(){
					updateDetails();
				},
				empDetails: function(a){
					details=a;
				},
				getDOM: function(){
					return DOM;
				},
				popup:function(){
					updateFormFields();				
					DOM.popup.style.display='block';
					DOM.home.style.position='absolute';
				},				
				closePopup:function(){
					DOM.popup.style.display='none';
					DOM.home.style.position='absolute';
				},
				readData:function(){
					var checkData,data;
					data={
						id:DOM.empId.value,
						employee_name: DOM.empName.value,
						employee_age: DOM.empAge.value,
						employee_salary: DOM.empSalary.value,
					}
					checkData=dataValidation(data);
					return (checkData)?data:0;			
				}		
			}
		})();
		
		var APIcontroller=(function(){
			var DOM=UIcontroller.getDOM();		
			var	empInit =async function(url){
					var id,idDetails;
					id=UIcontroller.getURLparameters(url);
					return id;
			}
			var putDetails=function(){
				//read details from popup through UIcontroller
				var empDetails=UIcontroller.readData();
				if(empDetails){
					DOM.errorMsg.style.visibility='hidden';
					//close popup
					UIcontroller.closePopup();
					//for temporary
					//update details
					UIcontroller.empDetails(empDetails);
					//update page
					UIcontroller.showDetails();
					//update popup
				
					//put the details using putMethod in server
					EMPcontroller.putData(empDetails);					
				}
			}
			var eventListenrs=function(){
				DOM.updateButton.addEventListener("click",UIcontroller.popup);
				DOM.addPopup.addEventListener('click',putDetails);
				DOM.cancelPopup.addEventListener('click',UIcontroller.closePopup);
				DOM.spanPopup.addEventListener('click',UIcontroller.closePopup);
			}	
			return{
				init: async function(){
					var id=await empInit(url);
					var empData=await EMPcontroller.fetchDetails();
					if(id<=empData.length){
						UIcontroller.empDetails(empData[id-1]);
						UIcontroller.showDetails();
						eventListenrs();
					}
					else{
					document.write('<h1 style="text-align:center;padding-top:20%">Details are not uploaded yet.</h1>');
					}
				}
			}
		})();
		
		
var EMPcontroller=(function(){
	var empData;
	var getIds=function(){
		return empData.map(cur=>cur.id);
	}
	var idExists=function(id){
		for(var i=0;i<empData.length;i++){
			if(id===empData[i].id){
				return i;
			}
		}
		return -1;
	}		
	return{
		fetchDetails: async function(){
			var data;
			data=await fetch('http://dummy.restapiexample.com/api/v1/employees');
			empData=await data.json();
			empData=empData.data;
			return empData;
		},
		getIdDetails:function(id){
			var idList,isIdExists;
			isIdExists=idExists(id);
			if(isIdExists!==-1){
				return id;
			}
			return -1;
		},
		putData:async function(empDetails){
			var id=parseInt(empDetails.id);
			var put=await fetch('http://dummy.restapiexample.com/api/v1/update/'+id+'/',{
				method:"PUT",
				body: JSON.stringify({ 
					"id":empDetails.id,
					"employee_name":empDetails.employee_name,
					"employee_salary":empDetails.employee_age,
					"profile_image":" ",
					}),
			})
		}

	}
})();
APIcontroller.init();
