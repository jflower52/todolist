package com.ohj.doneday;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(GoogleAuthPlugin.class);
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onPause() {
        super.onPause();
        DoneDayWidget.updateAllWidgets(this);
    }

    @Override
    public void onResume() {
        super.onResume();
        DoneDayWidget.updateAllWidgets(this);
    }
}