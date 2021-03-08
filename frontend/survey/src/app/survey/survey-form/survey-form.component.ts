import { Component, OnInit } from '@angular/core';

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
  constructor(
    private _formBuilder: FormBuilder,
    public firebaseService:FirebaseService
  ) { }

  ngOnInit(): void {
    this.firebaseService.readJSON('pages').subscribe( (data) => {
      console.log(data);
      this.pages = data;
    });
    this.firebaseService.readJSON('questions').subscribe( (data) => {
      console.log("questions are", data);
      this.questions = data;
    });
    this.firebaseService.readJSON('options').subscribe( (data) => {
      console.log("options are", data);
      this.options = data;
    });
    this.firebaseService.getIP().subscribe( (resp) => {
      var ip = resp["ip"];
      var currentDate = new Date();
      var timestamp = currentDate.toISOString().split(".")[0];
      var docID = timestamp+"_"+ip;
      console.log("docID is", docID);
      var data = {
        timestamp : timestamp,
        ip : ip
      }
      this.firebaseService.setData(docID, data).then(() => {
        console.log("Document successfully created!");
	this.docID = docID;
	this.docReady = true;
      })
      .catch(err => console.log(err));
    });
    this.setupForms();
    
   // this.createDocument();
  }
  setupForms(){
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
	radioChange($event, question){
		console.log("radio has changed", $event);
		var value = $event.value;
		var data:any = {}
		data[question["questionValue"]] =  value;
		this.updateData(this.docID, data);

	}
	updateTextInput($event, question){
		console.log("updating text input", $event.target.value);
		var value = $event.target.value;
		var data:any = {}
		data[question["questionValue"]] =  value;
		this.updateData(this.docID, data);
	}
  updateData(docID, data){
      this.firebaseService.update(docID, data).then(() => {
        console.log("Updates succwssfully !!")
      }).catch(err => console.log(err));
  } 
}
