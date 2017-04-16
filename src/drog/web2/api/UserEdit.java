package drog.web2.api;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.mindrot.BCrypt;

import darb.web2.JDBConnection;
import darb.web2.yayson.YaySon;
import darb.web2.yayson.YaySonArray;
import drog.web2.NotificationSocket;
import drog.web2.User;

/**
 * Servlet implementation class UserEdit
 */
@WebServlet("/api/user/edit")
public class UserEdit extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserEdit() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		response.setHeader("Content-Type", "application/json" );
		YaySon res = new YaySon();
		if (session.isNew() || user == null) {
			res.add("status", 403);
			res.add("error", "No permission to access this resource");
		} else {
			Integer id_user = user.getUserId();
			String name = request.getParameter("name") == null ? user.getName() : request.getParameter("name");
			String email = request.getParameter("email") == null ? user.getEmail(): request.getParameter("email");
			Integer id_role  =request.getParameter("id_role") == null ? user.getRoleId() : Integer.parseInt(request.getParameter("id_role"));
			String password = request.getParameter("password") == null ? "" : request.getParameter("password");
		
			String getPassword = "Select users.password "
					+ "FROM users "
					+ "WHERE users.id_user=? ";
			String query = "SELECT id_user, id_role, name, email, password FROM users WHERE id_user = ?";
			String updateQuery = "UPDATE users SET name = ?, email = ?, id_role=? ";
			String updateFinisher = "WHERE id_user=? RETURNING id_user";
			try {
				JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");
				String[][] update_result = new String[2][1];
				String[][] newUser = null;
				if(password.length() != 0 ){
					updateQuery += ", password = ? ";
					updateQuery += updateFinisher;
					update_result = conn.executeQuery(updateQuery, name, email,id_role,BCrypt.hashpw(password, BCrypt.gensalt()),id_user);
				}
				else{
					updateQuery += updateFinisher;
					update_result = conn.executeQuery(updateQuery, name, email,id_role,id_user);
				}
				newUser = conn.executeQuery(query, Integer.parseInt(update_result[1][0]));
				id_user = Integer.parseInt(newUser[1][0]);
				id_role = Integer.parseInt(newUser[1][1]);
				name = newUser[1][2];
				email = newUser[1][3]; 
				password = newUser[1][4];
				User JUser = new User(id_user,id_role,name,email);
				session.setAttribute("user", JUser);
				YaySon data = new YaySon();
				data.add("id_user", id_user);
				data.add("id_role", id_role);
				data.add("name", name);
				data.add("email", email);
				res.add("status", 200);
				res.add("data", data);
			} catch(Exception e) {
				e.printStackTrace();
				res.add("status", 500);
			}
		}		
		
		response.setStatus(res.getInteger("status"));
		response.getWriter().print(res.toJSON());
		
	}

}
