window.onload=()=>{
var UIcontroller=(function(){
	var DOM ={
		home : document.querySelector('.container'),
		empList:document.querySelector('.empbody'),
		employeePage : 'employee.html?id=%id%',
		newEmpButton : document.querySelector('#newBut'),
		popup : document.querySelector('.popup'),
		addPopup:document.querySelector('#popup-add'),
		cancelPopup:document.querySelector('#popup-cancel'),
		empName:document.querySelector('input[name="name"]'),
		empAge:document.querySelector('input[name="age"]'),
		empSalary:document.querySelector('input[name="salary"]'),
		spanPopup:document.querySelector('.close'),
		empRow:document.querySelector('.row'),
		errorMsg:document.querySelector('.error'),
		
	}
	var clearFields=function(){
				DOM.empName.value='';
				DOM.empAge.value=' ';
				DOM.empSalary.value=' ';		
	}
	var nameValidation=function(name)
	{
		var exp;
		exp=/^[a-zA-Z]+(\s[a-zA-Z]+)?$/;
		if(!name.match(exp)){
			DOM.errorMsg.innerHTML='Only letters are allowed in the name';
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
		else{
			if(age<18){
				DOM.errorMsg.innerHTML='age must be grater the 18';
				return 0;
			}
			else{
				return 1;
			}
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
		if(data.name && data.age && data.salary)
		{
			a=nameValidation(data.name);
			a&=ageValidation(data.age);
			a&=salaryValidation(data.salary);
		}
		else{
			DOM.errorMsg.innerHTML='enter valid details';
		}
		return a;
	}
	return {
		addItem : function(id,name){
 			var html="<div class='row' id=%id%><label class='id'>%id%</label><label class='name'><a href=%link%>%name%</a></label></div>";
			var newHtml=html.replace('%link%',DOM.employeePage);
			newHtml=newHtml.replace(/%id%/g,id);  
			newHtml=newHtml.replace('%name%',name);
			newHtml=newHtml.replace()
			DOM.empList.insertAdjacentHTML('beforeend',newHtml);
		},
		getDOM: function(){
			return DOM;
		},
		closePopup(){
			DOM.popup.style.display='none';
			DOM.home.style.position='absolute';
			DOM.errorMsg.style.visibility='hidden';
		},
		readData :function(){
			var data,checkData;
			data={
				id:0,
				name: DOM.empName.value,
				age: DOM.empAge.value,
				salary: DOM.empSalary.value,
			}
			checkData=dataValidation(data);
			return (checkData)?data:0;
		},
		popup:function(){
			DOM.popup.style.display='block';
			DOM.home.style.position='absolute';
			clearFields();
		}	
	}
})();

var APIcontroller=(function(){
	var DOM=UIcontroller.getDOM();

	var updateEmpDetalis= function(){
		var empDetails,checkData;
		empDetails=UIcontroller.readData();
		console.log(empDetails);
		if(empDetails){
			DOM.errorMsg.style.visibility='hidden';
			empDetails=EMPcontroller.updateData(empDetails);
			UIcontroller.addItem(empDetails.id,empDetails.name);
			UIcontroller.closePopup();
			EMPcontroller.putData(empDetails);			
		}
	}
	var	eventListeners=function(){
			DOM.newEmpButton.addEventListener('click',UIcontroller.popup);
			DOM.addPopup.addEventListener('click',updateEmpDetalis);
			DOM.cancelPopup.addEventListener('click',UIcontroller.closePopup);
			DOM.spanPopup.addEventListener('click',UIcontroller.closePopup);
		}
	return {
		init: async function(){
			var a=await	EMPcontroller.fetchData();
			eventListeners();
		}
	}
	
})();

var EMPcontroller=(function(){
	var empData;
	
	return{
		fetchData:async function(){
			var data=await fetch('http://dummy.restapiexample.com/api/v1/employees');
			var dataJson=await data.json();
			empData=dataJson.data;
			for(var i=0;i<empData.length;i++)
			{
				UIcontroller.addItem(empData[i].id,empData[i].employee_name);
			}
		},
		data: function(){
			return empData;
		},
		updateData: function(details){
			details.id=empData.length+1;
			empData.push(details);
			return details;
		},
		putData:async function(empDetails){
			var id=parseInt(empDetails.id);
			console.log(''+id);
			var put=await fetch('http://dummy.restapiexample.com/api/v1/update/'+id+'/',{
				method:"PUT",
				body: JSON.stringify({ 
					"id":empDetails.id,
					"employee_name":empDetails.ename,
					"employee_salary":empDetails.age,
					"profile_image":" ",
					}),
			})
		}		
	}	
})();	
APIcontroller.init();
};


