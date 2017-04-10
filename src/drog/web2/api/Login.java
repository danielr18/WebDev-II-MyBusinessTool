package drog.web2.api;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.mindrot.BCrypt;

import darb.web2.JDBConnection;
import darb.web2.yayson.YaySon;
import drog.web2.User;

/**
 * Servlet implementation class Login
 */
@WebServlet("/api/login")
public class Login extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Login() {
        super();
        // TODO Auto-generated constructor stub
    }

    
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String email = request.getParameter("email");
		String password = request.getParameter("password");
		
		HttpSession session = request.getSession();		
		User user = (User) session.getAttribute("user");
		response.setHeader("Content-Type", "application/json" );
		YaySon res = new YaySon();
		
		if (!session.isNew() && user != null) {
			res.add("status", 200);
			
			YaySon jUser = new YaySon();
			jUser.add("id_user", user.getUserId());
			jUser.add("id_role", user.getRoleId());
			jUser.add("name", user.getName());
			jUser.add("email", user.getEmail());
			
			res.add("data", jUser);
		} else {
			String query = "SELECT id_user, id_role, name, email, password FROM users WHERE email = ?";
			try {
				JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");
				String [][] table = conn.executeQuery(query, email);
				if (table.length > 1 && BCrypt.checkpw(password, table[1][4])) {
					Integer id_user = Integer.parseInt(table[1][0]);
					Integer id_role = Integer.parseInt(table[1][1]);
					user = new User(id_user, id_role, table[1][2], table[1][3]);
					session.setAttribute("user", user);
					res.add("status", 200);
					YaySon jUser = new YaySon();
					jUser.add("id_user", id_user);
					jUser.add("id_role", id_role);
					jUser.add("name", table[1][2]);
					jUser.add("email", table[1][3]);
					res.add("data", jUser);
				} else {
					res.add("status", 400);
					res.add("error", "Invalid Login");
					session.invalidate();
				}
			} catch(Exception e) {
				e.printStackTrace();
				res.add("status", 500);
				session.invalidate();
			}		
		}		

		response.setStatus(res.getInteger("status"));
		response.getWriter().print(res.toJSON());
	}

}
