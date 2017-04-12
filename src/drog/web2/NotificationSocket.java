package drog.web2;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map.Entry;
import java.util.UUID;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import darb.web2.yayson.YaySon;
import drog.web2.api.NotificationSocketSession;

@ServerEndpoint("/notifications")
public class NotificationSocket {
	public static HashMap<String, Session> clients = new HashMap<String, Session>();
	
	public static void sendNotification(Integer id_user, String message, String level) throws IOException, NullPointerException {
		//Level can be success, error, warning and info
		String ws_session_id = NotificationSocketSession.socket_session_ids.get(id_user);
		Session ws_session = clients.get(ws_session_id);
		YaySon notif = new YaySon();
		notif.add("type", "NOTIFICATION");
		notif.add("level", level);
		notif.add("msg", message);
		ws_session.getBasicRemote().sendText(notif.toJSON());
	}
	
	@OnOpen
    public void open(Session session) {
		System.out.println("Opened");
		String id = UUID.randomUUID().toString();
		clients.put(id, session);
		YaySon message = new YaySon();
		message.add("type", "SESSION_ID");
		message.add("id", id);
		try {
			session.getBasicRemote().sendText(message.toJSON());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@OnClose
    public void close(Session session) {
		for (Entry<String, Session> entry : clients.entrySet()) {
			if (entry.getValue() == session) {
				System.out.println("closed");
				clients.remove(entry.getKey());
			}
		} 
	}
	
	@OnError
    public void onError(Throwable error) {
		System.out.println(error);
	}
	
	@OnMessage
    public void handleMessage(String message, Session session) {
		System.out.println(message);
	}
	
}
