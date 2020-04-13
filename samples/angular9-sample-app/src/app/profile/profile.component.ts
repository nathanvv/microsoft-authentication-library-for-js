import { Component, OnInit } from '@angular/core';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile;

  constructor(
    private authService: MsalService,
    private broadcastService: BroadcastService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getProfile();
    this.broadcastService.subscribe('msal:acquireTokenSuccess', payload => {
      console.log(payload);
    //   if (payload && payload?.accessToken) {
    //     const header = {
    //       headers: new HttpHeaders()
    //         .set('Authorization',  `Basic ${btoa(payload?.accessToken)}`)
    //     };
    //     this.testVstsApi(header);
    //   }
    });
    this.testVstsApi(null);
  }

  getProfile() {
    this.http.get(GRAPH_ENDPOINT)
      .toPromise().then(profile => {
        this.profile = profile;
      });
  }

  public testVstsApi(header: { headers: HttpHeaders}): void {
    const endpoint = 'https://app.vssps.visualstudio.com/_apis/accounts?api-version=5.1';
    const endpoint2 = 'https://dev.azure.com/renweb/_apis/projects?api-version=2.0';
    this.http.get(endpoint)
      .toPromise().then(response => {
        console.log(response);
      });
  }

}
