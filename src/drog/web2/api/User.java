package drog.web2.api;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import darb.web2.JDBConnection;
import darb.web2.yayson.YaySon;
import darb.web2.yayson.YaySonArray;

/**
 * Servlet implementation class User
 */
@WebServlet("/api/user")
public class User extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public User() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		Integer id_role = request.getParameter("id_role") == null ? null :Integer.parseInt(request.getParameter("id_role"));
		Integer id_user = request.getParameter("id_user") == null? null : Integer.parseInt(request.getParameter("id_user"));
		Integer id_task = request.getParameter("id_task") == null? null : Integer.parseInt(request.getParameter("id_task"));
		HttpSession session = request.getSession();
		drog.web2.User user = (drog.web2.User) session.getAttribute("user");
		response.setHeader("Content-Type", "application/json" );
		YaySon res = new YaySon();
		if(session.isNew() || user == null){
			res.add("status",403);
			res.add("error", "No permission to access this resource");
		}
		else{
			if(id_role != null ){
				res = getUsersAboveRole(id_role);
			}
			else if(id_user != null ){
				res = getUserById(id_user);
			}
			else if(id_task != null){
				res = getUsersForTask(id_task);
			}
			else{
				res.add("status",403);
				res.add("error", "Wrong Arguments");
			}
		}
		response.setStatus(res.getInteger("status"));
		response.getWriter().print(res.toJSON());
	}

	private YaySon getUsersForTask(Integer id_task) {
		YaySon res = new YaySon();
		String query = "Select users.id_user, users.name, role.name "
				+ "From users "
				+ "INNER JOIN role ON users.id_role = role.id_role "
				+ "INNER JOIN task_user ON users.id_user = task_user.id_user "
				+ "INNER JOIN task ON task_user.id_task = task.id_task "
				+ "WHERE task.id_task = ?";
		try{
			String[][] usersTable = null;
			JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");						
			usersTable = conn.executeQuery(query, id_task);
			YaySonArray users= new YaySonArray();
			
			for(Integer i =1 ; i < usersTable.length ; i++){
				YaySon JUser = new YaySon();
				JUser.add("id_user", usersTable[i][0]);
				JUser.add("name", usersTable[i][1]);
				JUser.add("role", usersTable[i][2]);
				users.push(JUser);
			}
			res.add("status",200);
			res.add("data",users);
		} catch (Exception e){
			res.add("status",403);
			res.add("data","Invalid role");
		}
		return res;
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	private YaySon getUsersAboveRole(Integer id_role){
		YaySon res = new YaySon();
		String query = "Select users.id_user, users.name, role.name "
				+ "From users "
				+ "INNER JOIN role ON users.id_role = role.id_role "
				+ "WHERE users.id_role <= ?";
		try{
			String[][] usersTable = null;
			JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");						
			usersTable = conn.executeQuery(query, id_role);
			YaySonArray users= new YaySonArray();
			
			for(Integer i =1 ; i < usersTable.length ; i++){
				YaySon JUser = new YaySon();
				JUser.add("id_user", usersTable[i][0]);
				JUser.add("name", usersTable[i][1]);
				JUser.add("role", usersTable[i][2]);
				users.push(JUser);
			}
			res.add("status",200);
			res.add("data",users);
		} catch (Exception e){
			res.add("status",403);
			res.add("data","Invalid role");
		}
		return res;

	}
	
	private YaySon getUserById (Integer id_user){
		YaySon res = new YaySon();
		String query = "Select users.id_user, users.name, role.name "
				+ "From users "
				+ "INNER JOIN role ON users.id_role = role.id_role "
				+ "WHERE users.id_user = ?";
		String[][] usersTable = null;
		try{
			JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");						
			usersTable = conn.executeQuery(query, id_user);
			YaySon JUser = new YaySon();
			JUser.add("id_user", usersTable[1][0]);
			JUser.add("name", usersTable[1][1]);
			JUser.add("role", usersTable[1][2]);
			res.add("status",200);
			res.add("data",JUser);
		}catch (Exception e){
			res.add("status",200);
			res.add("error","Invalid user");
		}
		return res;
	}
}
