package com.saw.game;
import android.content.res.AssetManager;
import org.json.*;
import java.io.*;import java.net.*;import java.security.MessageDigest;import java.util.*;import java.util.concurrent.*;
class Srv{
  static final Map<String,C> cl=new ConcurrentHashMap<String,C>();
  static class C{Socket s;OutputStream o;String id,name="w",ip="",role="guest";boolean pend;}
  static void start(final AssetManager am,final CountDownLatch up){
    new Thread(new Runnable(){public void run(){
      try{ServerSocket ss=new ServerSocket();ss.setReuseAddress(true);ss.bind(new InetSocketAddress(8787));up.countDown();
        while(true){final Socket s=ss.accept();new Thread(new Runnable(){public void run(){conn(s,am);}}).start();}
      }catch(Exception e){up.countDown();}
    }}).start();
  }
  static String line(InputStream in)throws IOException{StringBuilder b=new StringBuilder();int c;while((c=in.read())!=-1){if(c==10)return b.toString();if(c!=13)b.append((char)c);}return b.length()==0?null:b.toString();}
  static void readN(InputStream in,byte[] a)throws IOException{int n=0;while(n<a.length){int r=in.read(a,n,a.length-n);if(r<0)throw new EOFException();n+=r;}}
  static byte[] read(InputStream in)throws IOException{ByteArrayOutputStream o=new ByteArrayOutputStream();byte[] b=new byte[8192];int r;while((r=in.read(b))>0)o.write(b,0,r);in.close();return o.toByteArray();}
  static void conn(Socket s,AssetManager am){
    try{s.setTcpNoDelay(true);s.setKeepAlive(true);InputStream in=new BufferedInputStream(s.getInputStream());OutputStream o=s.getOutputStream();
      String req=line(in);if(req==null){s.close();return;}
      String key=null,h;while((h=line(in))!=null&&h.length()>0){if(h.toLowerCase().startsWith("sec-websocket-key:"))key=h.substring(18).trim();}
      if(key!=null){ws(s,in,o,key);return;}
      String[] p=req.split(" ");String u=p.length>1?p[1].split("\\?")[0]:"/";
      byte[] body;String ct="text/html; charset=utf-8";int code=200;
      if(u.equals("/ping")){body="saw-lan-ok".getBytes();ct="text/plain";}
      else if(u.equals("/")||u.equals("/index.html")){body=read(am.open("game.html"));}
      else{body="not found".getBytes();code=404;ct="text/plain";}
      o.write(("HTTP/1.1 "+code+" OK\r\nContent-Type: "+ct+"\r\nContent-Length: "+body.length+"\r\nCache-Control: no-store\r\nAccess-Control-Allow-Origin: *\r\nConnection: close\r\n\r\n").getBytes());
      o.write(body);o.flush();s.close();
    }catch(Exception e){try{s.close();}catch(Exception x){}}
  }
  static void ws(Socket s,InputStream in,OutputStream o,String key)throws Exception{
    String acc=android.util.Base64.encodeToString(MessageDigest.getInstance("SHA-1").digest((key+"258EAFA5-E914-47DA-95CA-C5AB0DC85B11").getBytes()),android.util.Base64.NO_WRAP);
    o.write(("HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: "+acc+"\r\n\r\n").getBytes());o.flush();
    C c=new C();c.s=s;c.o=o;c.id=Long.toHexString(System.nanoTime()&0xffffffffL);c.ip=s.getInetAddress().getHostAddress();cl.put(c.id,c);
    try{while(true){
      int b0=in.read(),b1=in.read();if(b1<0)break;
      int op=b0&15;long len=b1&127;
      if(len==126)len=(in.read()<<8)|in.read();else if(len==127){len=0;for(int i=0;i<8;i++)len=(len<<8)|in.read();}
      byte[] mk=new byte[4];boolean m=(b1&128)!=0;if(m)readN(in,mk);
      byte[] pl=new byte[(int)len];readN(in,pl);
      if(m)for(int i=0;i<pl.length;i++)pl[i]^=mk[i&3];
      if(op==8)break;
      if(op==9){send(c,0x8A,pl);continue;}
      if(op!=1)continue;
      try{msg(c,new JSONObject(new String(pl,"UTF-8")));}catch(Exception e){}
    }}catch(Exception e){}
    bye(c);try{s.close();}catch(Exception e){}
  }
  static void send(C c,int op,byte[] d){try{synchronized(c){int n=d.length;ByteArrayOutputStream b=new ByteArrayOutputStream();b.write(op);
    if(n<126)b.write(n);else if(n<65536){b.write(126);b.write(n>>8);b.write(n&255);}else{b.write(127);for(int i=7;i>=0;i--)b.write((int)(((long)n>>(8*i))&255));}
    b.write(d);c.o.write(b.toByteArray());c.o.flush();}}catch(Exception e){}}
  static void sj(C c,JSONObject j){try{send(c,0x81,j.toString().getBytes("UTF-8"));}catch(Exception e){}}
  static void bc(JSONObject j,String except){for(C c:cl.values())if(!c.id.equals(except))sj(c,j);}
  static JSONArray roster(){JSONArray a=new JSONArray();try{for(C c:cl.values()){JSONObject r=new JSONObject();r.put("id",c.id);r.put("n",c.name);r.put("ip",c.ip);r.put("role",c.role);r.put("pending",c.pend);a.put(r);}}catch(Exception e){}return a;}
  static C admin(){for(C c:cl.values())if(c.role.equals("admin"))return c;return null;}
  static void msg(C c,JSONObject m)throws Exception{
    String t=m.optString("t","");if(t.length()==0)return;
    if(t.equals("hi")){
      if(m.has("n"))c.name=m.optString("n").substring(0,Math.min(14,m.optString("n").length()));
      if(admin()==null)c.role="admin";
      JSONObject w=new JSONObject();w.put("t","welcome");w.put("id",c.id);w.put("role",c.role);w.put("roster",roster());sj(c,w);
      JSONObject r=new JSONObject();r.put("t","roster");r.put("i",c.id);r.put("roster",roster());bc(r,c.id);return;}
    if(t.equals("join")){
      if(m.has("n"))c.name=m.optString("n").substring(0,Math.min(14,m.optString("n").length()));
      if(c.role.equals("admin"))return;C a=admin();
      if(a!=null){c.role="player";c.pend=false;JSONObject j=new JSONObject();j.put("t","joined");j.put("id",c.id);j.put("roster",roster());sj(c,j);bc(j,c.id);}
      else{JSONObject f=new JSONObject();f.put("t","full");f.put("msg","nobody is hosting");sj(c,f);}return;}
    if(t.equals("ok")||t.equals("no")){
      if(!c.role.equals("admin"))return;C g=cl.get(m.optString("id"));if(g==null)return;
      if(t.equals("ok")){g.role="player";g.pend=false;JSONObject j=new JSONObject();j.put("t","joined");j.put("id",g.id);j.put("roster",roster());sj(g,j);bc(j,g.id);}
      else{g.pend=false;JSONObject d=new JSONObject();d.put("t","denied");sj(g,d);}return;}
    if(c.role.equals("player")||c.role.equals("admin")){m.put("i",c.id);bc(m,c.id);}
  }
  static void bye(C c){
    cl.remove(c.id);boolean wasA=c.role.equals("admin");
    try{if(!c.role.equals("guest")){JSONObject b=new JSONObject();b.put("t","b");b.put("i",c.id);bc(b,null);}
      if(wasA){C h=null;for(C x:cl.values())if(x.role.equals("player")){h=x;break;}
        if(h!=null){h.role="admin";JSONObject a=new JSONObject();a.put("t","admin");a.put("roster",roster());sj(h,a);
          JSONObject a2=new JSONObject();a2.put("t","admin");a2.put("id",h.id);a2.put("roster",roster());bc(a2,h.id);}}}catch(Exception e){}
  }
  static String ip(){try{String best=null;for(NetworkInterface n:Collections.list(NetworkInterface.getNetworkInterfaces())){if(!n.isUp()||n.isLoopback())continue;
    for(InetAddress a:Collections.list(n.getInetAddresses())){if(a instanceof Inet4Address&&a.isSiteLocalAddress()){String h=a.getHostAddress(),nm=n.getName();
      if(nm.startsWith("wlan")||nm.startsWith("ap")||nm.startsWith("swlan"))return h;if(best==null)best=h;}}}return best==null?"":best;}catch(Exception e){return "";}}
}
