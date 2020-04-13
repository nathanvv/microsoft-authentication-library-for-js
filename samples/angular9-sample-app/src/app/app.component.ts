import { Component, OnInit } from '@angular/core';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { Logger, CryptoUtils, AuthenticationParameters } from 'msal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MSAL - Angular 9 Sample App';
  isIframe = false;
  loggedIn = false;

  constructor(private broadcastService: BroadcastService, private authService: MsalService) { }

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;

    this.checkoutAccount();

    this.broadcastService.subscribe('msal:loginSuccess', () => {
      this.checkoutAccount();
    });

    this.authService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }

      console.log('Redirect Success: ', response);
    });

    this.authService.setLogger(new Logger((logLevel, message, piiEnabled) => {
      console.log('MSAL Logging: ', message);
    }, {
      correlationId: CryptoUtils.createNewGuid(),
      piiLoggingEnabled: false
    }));

    // const authParams: AuthenticationParameters = {
    //   scopes: [
    //     // '499b84ac-1321-427f-aa17-267ca6975798/.default',
    //     // 'https://spsprodeus24.vssps.visualstudio.com/.default',
    //     // '499b84ac-1321-427f-aa17-267ca6975798/user_impersonation',
    //     'https://app.vssps.visualstudio.com/user_impersonation'
    //   ]
    // };

    // this.authService.acquireTokenSilent(authParams).then((token) => {
    //   if (token) {
    //     console.log(token);
    //   }
    // }, (error) => {
    //   const errorParts = error.split('|');
    //   console.error('msal:loginFailure', errorParts[0], errorParts[1]);
    // });
  }

  checkoutAccount() {
    this.loggedIn = !!this.authService.getAccount();
  }

  login() {
    const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

    if (isIE) {
      this.authService.loginRedirect();
    } else {
      this.authService.loginPopup();
    }
  }

  logout() {
    this.authService.logout();
  }
}
