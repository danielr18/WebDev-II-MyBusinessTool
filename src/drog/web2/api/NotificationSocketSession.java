package drog.web2.api;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.websocket.Session;

import darb.web2.yayson.YaySon;
import drog.web2.User;

/**
 * Servlet implementation class NotificatioSocketSession
 */
@WebServlet("/api/notification-socket-session")
public class NotificationSocketSession extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public static HashMap<Integer, String> socket_session_ids = new HashMap<Integer, String >();
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public NotificationSocketSession() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String session_id = request.getParameter("session_id");
		HttpSession session = request.getSession();		
		response.setHeader("Content-Type", "application/json" );
		// response.setHeader("Access-Control-Allow-Origin", "*" );
		YaySon res = new YaySon();
		
		if (session.isNew()) {
			res.add("status", 403);
			res.add("error", "Need to be logged in");
		} else {
			User user = (User) session.getAttribute("user");
			socket_session_ids.put(user.getUserId(), session_id);
			res.add("status", 200);
			YaySon data = new YaySon();
			data.add("message", "Session id added");
			res.add("data", data);
		}

		response.setStatus(res.getInteger("status"));
		response.getWriter().print(res.toJSON());
		
	}

}
