package com.ohj.doneday;

import android.content.Intent;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

@CapacitorPlugin(name = "NativeGoogleAuth")
public class GoogleAuthPlugin extends Plugin {

    @PluginMethod
    public void signIn(PluginCall call) {
        String webClientId = "299107853494-ngshr9gp54puubuv2o42urnbfmg499f6.apps.googleusercontent.com";

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(webClientId)
                .requestEmail()
                .build();

        GoogleSignInClient client = GoogleSignIn.getClient(getActivity(), gso);
        client.signOut().addOnCompleteListener(task -> {
            Intent signInIntent = client.getSignInIntent();
            startActivityForResult(call, signInIntent, "handleSignInResult");
        });
    }

    @ActivityCallback
    private void handleSignInResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(result.getData());
        try {
            GoogleSignInAccount account = task.getResult(ApiException.class);
            String idToken = account.getIdToken();
            if (idToken != null) {
                JSObject ret = new JSObject();
                ret.put("idToken", idToken);
                call.resolve(ret);
            } else {
                call.reject("ID 토큰을 가져오지 못했습니다.");
            }
        } catch (ApiException e) {
            call.reject("구글 로그인 실패 (오류 코드: " + e.getStatusCode() + ")", e);
        }
    }
}