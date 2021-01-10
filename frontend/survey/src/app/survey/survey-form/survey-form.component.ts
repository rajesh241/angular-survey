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

  constructor(
    private _formBuilder: FormBuilder,
    public firebaseService:FirebaseService
  ) { }

  ngOnInit(): void {
    this.firebaseService.readJSON('survey').subscribe( (data) => {
      console.log(data);
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
        this.updateData(docID, {"name" : "rajesh"});
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
  updateData(docID, data){
      this.firebaseService.update(docID, data).then(() => {
        console.log("Updates succwssfully !!")
      }).catch(err => console.log(err));
  } 
}
