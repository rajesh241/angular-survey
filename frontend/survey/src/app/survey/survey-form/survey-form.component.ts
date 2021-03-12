import { Component, OnInit } from '@angular/core';
import {forkJoin} from 'rxjs';


import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service' 
@Component({
  selector: 'app-survey-form',
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.scss']
})
export class SurveyFormComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = false;
  docID:any;
  pages:any = [];
  questions:any = [];
  options:any = [];
  docReady:boolean = false;
  selectedSupIndex:number = 0;
	selectedSupName:string = '';
  supNames:any ;	
  constructor(
    private _formBuilder: FormBuilder,
    public firebaseService:FirebaseService
  ) { }

  ngOnInit(): void {
    this.selectedSupIndex = this.randomIntFromInterval(0,3);
		forkJoin(
			 this.firebaseService.readJSON('sups'),
			 this.firebaseService.readJSON('pages'),
			 this.firebaseService.readJSON('questions'),
			 this.firebaseService.readJSON('options'),
			 this.firebaseService.getIP()
		).subscribe(([sups, pages, questions, options, resp]) => {
      this.supNames = sups;
			this.selectedSupName = this.supNames[this.selectedSupIndex];
      this.pages = pages;
			this.questions = questions;
			this.options = options;
			this.updateSupName();
      var ip = resp["ip"];
      var currentDate = new Date();
      var timestamp = currentDate.toISOString().split(".")[0];
      var docID = timestamp+"_"+ip;
      console.log("docID is", docID);
      var data = {
        timestamp : timestamp,
        ip : ip,
				supName: this.selectedSupName
      }
      this.firebaseService.setData(docID, data).then(() => {
        console.log("Document successfully created!");
	      this.docID = docID;
	      this.docReady = true;
      })
      .catch(err => console.log(err));
		});
   //this.firebaseService.readJSON('pages').subscribe( (data) => {
   //  console.log(data);
   //  this.pages = data;
   //});
	 //
   //this.firebaseService.readJSON('sups').subscribe( (data) => {
   //  console.log("supnames is", data);
   //  this.supNames = data;
	 //	this.selectedSupName = this.supNames[this.selectedSupIndex];
   //});
   //this.firebaseService.readJSON('questions').subscribe( (data) => {
   //  console.log("questions are", data);
   //  this.questions = this.updateSupName("questions")
   //});
   //this.firebaseService.readJSON('options').subscribe( (data) => {
   //  console.log("options are", data);
   //  this.options = data;
   //});
   //this.firebaseService.getIP().subscribe( (resp) => {
   //});
    this.setupForms();
    
   // this.createDocument();
  }
	updateSupName(){
		var description = '';
		var re = /SUP_BIHAR/gi; 
    var qArray:any;
		var qLabel:any;
		for(let page of this.pages){
			description  = page.description.replace(re, this.selectedSupName)
			page["updatedDescription"] = description
			//page["updatedDescription"] = "<p>how are you</p><p><b>bold</b></p>";
		}

		for (let key of Object.keys(this.questions)){
			qArray = this.questions[key];
			for (let q of qArray){
				qLabel = q.questionLabel.replace(re, this.selectedSupName);
				q["updatedQuestionLabel"] = qLabel;
			}
		}
		console.log("updated questions", this.questions);
	}
  randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }	
  setupForms(){
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
	radioChange($event, question, qid, stepper){
		console.log("radio has changed", $event);
		var value = $event.value;
		var data:any = {}
		data[question["questionValue"]] =  value;
		console.log("processing {question}");
		if(question.triggerNextPage == "1"){
			stepper.next();
		}
		this.updateData(this.docID, data);

	}
	updateTextInput($event, question){
		console.log("updating text input", $event.target.value);
		var value = $event.target.value;
		var data:any = {}
		data[question["questionValue"]] =  value;
		this.updateData(this.docID, data);
	}
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }
	checkbox_change(option){
	  console.log("Checkbox has changed", option);
	}
  updateData(docID, data){
      this.firebaseService.update(docID, data).then(() => {
        console.log("Updates succwssfully !!")
      }).catch(err => console.log(err));
  } 
}
