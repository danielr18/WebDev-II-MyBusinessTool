package drog.web2.api;

import java.io.IOException;
import java.sql.Timestamp;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import darb.web2.JDBConnection;
import darb.web2.yayson.YaySon;
import drog.web2.User;

//TODO:Major refactor if we have time
/**
 * Servlet implementation class Task
 */
@WebServlet("/Task")
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
			res= getAllTasks(request);
		}
		else if(id_task != null){
			res = getOneTask(request);
		}
		else{
			res.add("status","403");
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
			String getQuery = "SELECT task.id_task, task.name, task.description, task.created_at, task_status.name"
					+ "FROM task "
					+ "INNER JOIN task_status ON task.id_task_status = task_status.id_task_status"
					+ "WHERE id_task=?";
			try {
				JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");
				String[][] insert_result = conn.executeQuery(insertQuery, name, description, now, id_project,id_task_status);
				String[][] taskTable = conn.executeQuery(getQuery, insert_result[1][0]);
				YaySon task = new YaySon();
				task.add("id_project", id_project.toString());
				task.add("name", taskTable[1][1]);
				task.add("description", taskTable[1][2]);
				task.add("created_at", taskTable[1][3]);
				task.add("status", taskTable[1][4]);
				res.add("status", 200);
				res.add("data", task);
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
	private YaySon getOneTask(HttpServletRequest request){
		YaySon res = new YaySon();
		HttpSession session = request.getSession();		
		User user = (User) session.getAttribute("user");
		Boolean belongs = false;
		if (session.isNew()) {
			res.add("status", 403);
			res.add("error", "No permission to access this resource");
		} else {
			Integer id_task = null;
			
			try {
				id_task= Integer.parseInt(request.getParameter("id_task"));
			} catch(NumberFormatException e) {
				res.add("status", 403);
				res.add("error", "Invalid task id");
			}
			
			belongs = belongsToProjectByTask(id_task,user);
			
			if(belongs){
				if (id_task != null) {
					try {
						String query = "SELECT task.id_task, task.name, project.name, task_status.name, users.name, task.description, task.created_at "
								+ "FROM task "
								+ "INNER JOIN project ON  task.id_task = project.id_task "
								+ "INNER JOIN task_status ON task.id_task_status = task_status.id_task_status "
								+ "INNER JOIN task_user ON task.id_task = task_user.id_task "
								+ "INNER JOIN users ON task_user.id_user = users.id_user "
								+ "WHERE task.id_task=?";
						JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");
						String[][] table = conn.executeQuery(query, id_task);
						YaySon task = new YaySon();
						task.add("id_task", id_task.toString());
						task.add("name", table[1][1]);
						task.add("project_name", table[1][2]);
						task.add("status", table[1][3]);
						task.add("description", table[1][5]);
						task.add("created_at", table[1][6]);
						String[] users = new String[table.length - 1];
						for(Integer i = 1 ; i < table.length ; i++){
							users[i] = table[i][4];
						}
						task.add("user", users);
						res.add("status", 200);
						res.add("data", task);
					} catch(Exception e) {
						e.printStackTrace();
						res.add("status", 500);
						session.invalidate();
					}	
				}
			}
		
		}
		return res;		
	}
	
	private YaySon getAllTasks(HttpServletRequest request){
		YaySon res = new YaySon();
		HttpSession session = request.getSession();		
		User user = (User) session.getAttribute("user");
		Boolean belongs = false;
		if (session.isNew()) {
			res.add("status", 403);
			res.add("error", "No permission to access this resource");
		} else {
			Integer id_project = null;
			
			try {
				id_project= Integer.parseInt(request.getParameter("id_project"));
			} catch(NumberFormatException e) {
				res.add("status", 403);
				res.add("error", "Invalid task id");
			}
			
			belongs = belongsToProjectByProject(id_project,user);
			
			if(belongs){
				if (id_project != null) {
					try {
						String query = "SELECT task.id_task, task.name, project.name, task_status.name, users.name, task.description, task.created_at "
								+ "FROM task "
								+ "INNER JOIN project ON  task.id_project = project.id_project "
								+ "INNER JOIN task_status ON task.id_task_status = task_status.id_task_status "
								+ "INNER JOIN task_user ON task.id_task = task_user.id_task "
								+ "INNER JOIN users ON task_user.id_user = users.id_user "
								+ "WHERE project.id_project=?";
						JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");
						String[][] table = conn.executeQuery(query, id_project);
						YaySon task = new YaySon();
						//TODO: Check below or change query, repeated rows
						String[] id_tasks = new String[table.length-1];
						String[] names = new String[table.length - 1];
						String project_name = table[1][2];
						String[] stats = new String[table.length - 1];
						String[] users = new String[table.length - 1];
						String[] descriptions = new String[table.length - 1];
						String[] creation_dates = new String[table.length - 1];
						
						for(Integer i = 1 ; i < table.length ; i++){
							id_tasks[i-1] = table[i][0]; 
							names[i-1] = table[i][1];
							stats[i-1] = table[i][3];
							users[i-1] = table[i][4];
							descriptions[i-1] = table[i][5];
							creation_dates[i-1] = table[i][6];
						}
						task.add("id_task", id_tasks);
						task.add("name", names);
						task.add("project_name", project_name);
						task.add("status", stats);
						task.add("description", descriptions);
						task.add("created_at", creation_dates);
						task.add("user", users);
						res.add("status", 200);
						res.add("data", task);
					} catch(Exception e) {
						e.printStackTrace();
						res.add("status", 500);
						session.invalidate();
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
	//			 /GetHelpers			   	  //
	//										  //
	////////////////////////////////////////////
}
