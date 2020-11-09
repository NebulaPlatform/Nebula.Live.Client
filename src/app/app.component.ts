import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // setup your signature endpoint here: https://github.com/zoom/websdk-sample-signature-node.js
  signatureEndpoint = 'https://nebula-framework.herokuapp.com/';
  // signatureEndpoint = 'http://localhost:4000/';

  apiKey = 'UAW5toDfSje2dkLZYUXDtQ';
  meetingNumber = 75598836366;
  role = 0;
  leaveUrl = 'http://localhost:4200';
  userName = 'Angular';
  userEmail = '';
  passWord = 'dU8tEx';

  meetingId: number;
  password: number;
  joinUrl: string;
  startUrl: string;
  jwt: string;

  constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document) {}

  ngOnInit() {
    this.getJwToken();
  }

  getJwToken() {
    this.httpClient
      .get(this.signatureEndpoint + 'token', {})
      .subscribe((res) => {
        console.log(res);
        this.jwt = String(res);
      });
  }

  createMeeting() {
    this.httpClient
      .post(this.signatureEndpoint + 'create', {
        token: this.jwt,
      })
      .subscribe((res) => {
        console.log(res);
        if (res) {
          this.meetingId = res['id'];
          this.password = res['password'];
          this.joinUrl = res['join_url'];
          this.startUrl = res['start_url'];
        }
      });
  }

  getSignature() {
    this.httpClient
      .post(this.signatureEndpoint, {
        meetingNumber: this.meetingId,
        role: this.role,
      })
      .toPromise()
      .then((data: any) => {
        if (data.signature) {
          console.log(data.signature);
          this.startMeeting(data.signature);
        } else {
          console.log(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  startMeeting(signature) {
    document.getElementById('zmmtg-root').style.display = 'block';

    ZoomMtg.init({
      leaveUrl: this.leaveUrl,
      isSupportAV: true,
      success: (success) => {
        console.log(success);

        ZoomMtg.join({
          signature: signature,
          meetingNumber: this.meetingId,
          userName: this.userName,
          apiKey: this.apiKey,
          userEmail: this.userEmail,
          passWord: this.password,
          success: (success) => {
            console.log(success);
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
