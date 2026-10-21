package com.saw.game;
import android.app.Activity;import android.os.Bundle;import android.view.*;import android.webkit.*;
import java.util.concurrent.*;
public class MainActivity extends Activity{
  WebView wv;
  static class Br{@JavascriptInterface public String ip(){return Srv.ip();}}
  @Override protected void onCreate(Bundle b){
    super.onCreate(b);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    CountDownLatch up=new CountDownLatch(1);
    Srv.start(getAssets(),up);
    try{up.await(3,TimeUnit.SECONDS);}catch(Exception e){}
    wv=new WebView(this);
    WebSettings s=wv.getSettings();
    s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setMediaPlaybackRequiresUserGesture(false);
    wv.addJavascriptInterface(new Br(),"Android");
    wv.setWebViewClient(new WebViewClient());
    setContentView(wv);
    wv.loadUrl("http://127.0.0.1:8787/");
  }
  @Override public void onWindowFocusChanged(boolean f){super.onWindowFocusChanged(f);
    if(f)getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY|View.SYSTEM_UI_FLAG_FULLSCREEN|View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_LAYOUT_STABLE|View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN|View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);}
}
