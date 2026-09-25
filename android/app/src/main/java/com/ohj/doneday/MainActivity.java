package com.ohj.doneday;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
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