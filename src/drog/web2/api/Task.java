package drog.web2.api;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import darb.web2.JDBConnection;
import darb.web2.yayson.YaySon;
import darb.web2.yayson.YaySonArray;
import drog.web2.User;

//TODO:Major refactor if we have time
/**
 * Servlet implementation class Task
 */
@WebServlet("/api/task")
public class Task extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Task() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String id_task = request.getParameter("id_task");
		String id_project= request.getParameter("id_project") ;
		response.setHeader("Content-Type", "application/json" );
		YaySon res = new YaySon();
		if( id_project != null ){
			res= getAllTasks(request,Integer.parseInt(id_project));
		}
		else if(id_task != null){
			res = getOneTask(request,Integer.parseInt(id_task));
		}
		else{
			res.add("status",403);
			res.add("message","Invalid Parameters");
		}
		response.setStatus(res.getInteger("status"));
		response.getWriter().print(res.toJSON());
	}

	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession();		
		User user = (User) session.getAttribute("user");
		response.setHeader("Content-Type", "application/json" );
		YaySon res = new YaySon();
		if (session.isNew() || user.getRoleId() > 2) {
			res.add("status", 403);
			res.add("error", "No permission to access this resource");
		} else {
			String name = request.getParameter("name");
			String description = request.getParameter("description");
			Integer id_project = Integer.parseInt(request.getParameter("id_project"));
			Timestamp now = new Timestamp(System.currentTimeMillis());
			Integer id_task_status = 1;
			String insertQuery = "INSERT INTO task(name, description, created_at, id_project,id_task_status) VALUES (?,?,?,?,?) RETURNING id_task";
			String getQuery = "SELECT task.id_task, task.name, task.description, task.created_at, task_status.name "
					+ "FROM task "
					+ "INNER JOIN task_status ON task.id_task_status = task_status.id_task_status "
					+ "WHERE id_task=?";
			try {
				JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");
				String[][] insert_result = conn.executeQuery(insertQuery, name, description, now, id_project,id_task_status);
				res  = this.getOneTask(request, Integer.parseInt(insert_result[1][0]));
			} catch(Exception e) {
				e.printStackTrace();
				res.add("status", 500);
			}
		}		
		
		response.setStatus(res.getInteger("status"));
		response.getWriter().print(res.toJSON());
	}
	
	////////////////////////////////////////////
	//										  //
	//				GetHelpers			   	  //
	//										  //
	////////////////////////////////////////////
	private YaySon getOneTask(HttpServletRequest request, Integer id_task){
		YaySon res = new YaySon();
		HttpSession session = request.getSession();		
		User user = (User) session.getAttribute("user");
		Boolean belongs = false;
		if (session.isNew()) {
			res.add("status", 403);
			res.add("error", "No permission to access this resource");
		} else {
			
			belongs = (user.getRoleId() == 1 || user.getRoleId() == 2) ? true :belongsToProjectByTask(id_task,user);
			
			if(belongs){
				if (id_task != null) {
					try {
						String query = "SELECT task.id_task, task.name, project.name, task_status.name, task.description, task.created_at, task.ended_at "
								+ "FROM task "
								+ "INNER JOIN project ON  task.id_project = project.id_project "
								+ "INNER JOIN task_status ON task.id_task_status = task_status.id_task_status "
								+ "WHERE task.id_task=?";
						String usersQuery = "Select users.id_user, users.name, role.name "
								+ "FROM users "
								+ "INNER JOIN task_user ON users.id_user = task_user.id_user "
								+ "INNER JOIN role ON users.id_role = role.id_role "
								+ "WHERE task_user.id_task=? ";
						JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");
						String[][] table = conn.executeQuery(query, id_task);
						YaySon task = new YaySon();
						task.add("id_task", id_task.toString());
						task.add("name", table[1][1]);
						task.add("project_name", table[1][2]);
						task.add("status", table[1][3]);
						task.add("description", table[1][4]);
						task.add("created_at", table[1][5]);
						if (table[1][6] != "") task.add("ended_at", table[1][6]);
						String[][] usersTable = conn.executeQuery(usersQuery, id_task);
						YaySonArray ysa = (usersTable != null && usersTable.length < 2 )? null : new YaySonArray();
						if(ysa != null){
							for(Integer i = 1 ; i < usersTable.length ; i++){
									YaySon ys = new YaySon();
									ys.add("name", usersTable[i][1]);
									ys.add("role",usersTable[i][2]);
									ysa.push(ys);
							}
						}
						task.add("users", ysa == null? new YaySonArray() : ysa);
						res.add("status", 200);
						res.add("data", task);
					} catch(Exception e) {
						e.printStackTrace();
						res.add("status", 500);
					}	
				}
			}
		
		}
		return res;		
	}
	
	private YaySon getAllTasks(HttpServletRequest request, Integer id_project){
		YaySon res = new YaySon();
		HttpSession session = request.getSession();		
		User user = (User) session.getAttribute("user");
		Boolean belongs = false;
		if (session.isNew()) {
			res.add("status", 403);
			res.add("error", "No permission to access this resource");
		} else {
			belongs = (user.getRoleId() == 1 || user.getRoleId() == 2) ? true :belongsToProjectByProject(id_project,user);
			
			if(belongs){
				if (id_project != null) {
					try {
						String query = "SELECT task.id_task, task.name, project.name, task_status.name, task.description, task.created_at, task.ended_at "
								+ "FROM task "
								+ "INNER JOIN project ON  task.id_project = project.id_project "
								+ "INNER JOIN task_status ON task.id_task_status = task_status.id_task_status "
								+ "WHERE task.id_project=?";
						String usersQuery = "Select users.id_user, users.name, role.name "
								+ "FROM users "
								+ "INNER JOIN task_user ON users.id_user = task_user.id_user "
								+ "INNER JOIN role ON user.id_role = role.id_role "
								+ "INNER JOIN task ON task_user.id_task = task.id_task"
								+ "INNER JOIN project ON task.id_project = project.id_project"
								+ "WHERE project.id_project=? ";
						String usersQueryTask = "Select users.id_user, users.name, role.name "
								+ "FROM users "
								+ "INNER JOIN task_user ON users.id_user = task_user.id_user "
								+ "INNER JOIN role ON users.id_role = role.id_role "
								+ "INNER JOIN task ON task_user.id_task = task.id_task "
								+ "WHERE task.id_task=? ";
						String[][] table = null;
						JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");						
						table = conn.executeQuery(query, id_project);
						YaySonArray tArray = new YaySonArray();
						for(Integer i = 1 ; i < table.length ; i++){
							YaySon y = new YaySon();
							YaySonArray arr= new YaySonArray();
							y.add("id_task", table[i][0] == null ? "": table[i][0]);
							y.add("name", table[i][1] == null ? "": table[i][1]);
							y.add("project_name", table[i][2] == null ? "": table[i][2]);
							y.add("status", table[i][3] == null ? "": table[i][3]);
							y.add("description", table[i][4] == null ? "": table[i][4]);
							y.add("created_at", table[i][5] == null ? "": table[i][5]);
							if (table[i][6] != "") y.add("ended_at", table[i][6]);
							String[][] usersTable = table[i][0] == null ? null : conn.executeQuery(usersQueryTask,Integer.parseInt(table[i][0]));
							YaySonArray ysa = new YaySonArray();
							if(usersTable != null && usersTable.length>1){
								System.out.println(usersTable.length);
								for(Integer j = 1 ; j < usersTable.length ; j++){
										YaySon ys = new YaySon();
										ys.add("name", usersTable[j][1] == null?  "": usersTable[j][1]);
										ys.add("role",usersTable[j][2] == null?  "": usersTable[j][2]);
										ysa.push(ys);
								}
							}
							y.add("users", ysa);
							tArray.push(y);
						}
						res.add("status", 200);
						res.add("data", tArray);
					} catch(Exception e) {
						e.printStackTrace();
						res.add("status", 500);
						res.add("Damn");
					}	
				}
			}
		
		}
		return res;		
	}
	
	
	private Boolean belongsToProjectByTask(Integer id_task,User user){
		Boolean btp = false;
		Integer id_project = getProjectIdFromTask(id_task);
		try{
			String query = "SELECT users.id_user "
					+ "FROM users "
					+ "INNER JOIN task_user ON users.id_user = task_user.id_user "
					+ "INNER JOIN task ON task_user.id_task = task.id_task "
					+ "INNER JOIN project ON  task.id_project = project.id_project "
					+ "WHERE project.id_project=? "
					+ "AND users.id_user =?";
			JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");
			String[][] table = conn.executeQuery(query, id_project,user.getUserId());
			if(table.length > 1){
				btp = true;
			}				
		}catch (Exception e){
			e.printStackTrace();
		}
		return btp;
	}
	
	private Boolean belongsToProjectByProject(Integer id_project,User user){
		Boolean btp = false;
		try{
			String query = "SELECT users.id_user "
					+ "FROM users "
					+ "INNER JOIN task_user ON users.id_user = task_user.id_user "
					+ "INNER JOIN task ON task_user.id_task = task.id_task "
					+ "INNER JOIN project ON  task.id_project = project.id_project "
					+ "WHERE project.id_project=? "
					+ "AND users.id_user =?";
			JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");
			String[][] table = conn.executeQuery(query, id_project,user.getUserId());
			if(table.length > 1){
				btp = true;
			}				
		}catch (Exception e){
			e.printStackTrace();
		}
		return btp;
	}
	
	private Integer getProjectIdFromTask(Integer id_task){
		Integer res = null;
		try{
			String query = "SELECT project.id_project "
					+ "FROM project "
					+ "INNER JOIN task ON project.id_project = task.id_project "
					+ "WHERE task.id_task=?";
			JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");
			String[][] table = conn.executeQuery(query, id_task);
			if(table.length > 1){
				res = Integer.parseInt(table[1][0]);
			}				
		}catch (Exception e){
			e.printStackTrace();
		}
		return res;
	}
	
	
	////////////////////////////////////////////
	//										  //
	//			 /Helpers				   	  //
	//										  //
	////////////////////////////////////////////
}
