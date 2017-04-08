package drog.web2.api;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import darb.web2.yayson.YaySon;

/**
 * Servlet implementation class Logout
 */
@WebServlet("/api/logout")
public class Logout extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Logout() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		HttpSession session = request.getSession();		
		response.setHeader("Content-Type", "application/json" );
		YaySon res = new YaySon();
		
		if (session.isNew()) {
			res.add("status", 400);
			res.add("error", "Not logged in");
		} else {
			res.add("status", 200);
			YaySon data = new YaySon();
			data.add("message", "Logged out");
			res.add("data", data);
		}

		session.invalidate();
		response.setStatus(res.getInteger("status"));
		response.getWriter().print(res.toJSON());
	}

}
