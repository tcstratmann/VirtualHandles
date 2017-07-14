// Author: Tim Claudius Stratmann - 2016

import io.socket.client.*;
import io.socket.emitter.*;
import org.json.*;

// Documentation https://github.com/socketio/socket.io-client-java

public class MATJESVirtualHandlesConnector {

	public static void main(String[] args) {
		
		System.out.println("Socket.IO Example");

		try{	
			// initiate socket
			Socket socket = IO.socket("http://localhost:8080/");
			
			// establish connection
			socket.connect();
			
			// sending an object
			JSONObject obj = new JSONObject();
			obj.put("name", "rudder-angle-indicator").put("value", 35);
			socket.emit("data", obj);

			// receiving an object
			socket.on("data", new Emitter.Listener() {
			  @Override
			  public void call(Object... args) {
				JSONObject obj = (JSONObject)args[0];
				System.out.println(obj.toString());
			  }
			});

		}catch(Exception e){
			System.out.println(e);
		}
	}
}
