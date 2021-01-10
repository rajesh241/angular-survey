import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private dbPath = '/survey2021';
  collectionRef: AngularFirestoreCollection<any> = null;

  constructor(
    private http: HttpClient,
    private db: AngularFirestore
  ) { 
     this.collectionRef = db.collection(this.dbPath);
  }

  public readJSON(filename){
    return this.http.get("./assets/" + filename + ".json");
  }
  getIP(){
    return this.http.get("http://api.ipify.org/?format=json"); 
  }
  getAll(): AngularFirestoreCollection<any> {
    return this.collectionRef;
  }

  setData(docID, data): any {
    return this.collectionRef.doc(docID).set(data);
  }


  update(id: string, data: any): Promise<void> {
    return this.collectionRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.collectionRef.doc(id).delete();
  }

}
