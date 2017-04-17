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
import drog.web2.NotificationSocket;
import drog.web2.User;

/**
 * Servlet implementation class ProjectEdit
 */
@WebServlet("/api/task-edit")
public class TaskEdit extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TaskEdit() {
        super();
        // TODO Auto-generated constructor stub
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
			Integer id_task = null;
			String name = null;
			String description = null;
			Integer id_task_status = null;
			Timestamp now = null;
			Integer[] users = null;
			id_task = Integer.parseInt(request.getParameter("id_task"));
			
			String testQuery = "SELECT task.id_task, task.name, task.description, task.id_task_status "
					+ "FROM task "
					+ "WHERE task.id_task=?";
			String getQuery = "SELECT task.id_task, task.name, task.description, task.created_at, task.id_task_status, task_status.name, "
					+ "project.name, task.ended_at, project.id_project, project.id_leader "
					+ "FROM task "
					+ "INNER JOIN task_status ON task.id_task_status = task_status.id_task_status "
					+ "INNER JOIN project ON task.id_project = project.id_project "
					+ "WHERE task.id_task=?";
			String getUsers = "Select users.id_user, users.name, role.name "
					+ "FROM users "
					+ "INNER JOIN task_user ON users.id_user = task_user.id_user "
					+ "INNER JOIN role ON users.id_role = role.id_role "
					+ "WHERE task_user.id_task=? ";
			String updateQuery = "UPDATE task SET name = ?, description = ?, id_task_status=? ";
			String updateFinisher = "WHERE id_task=?";
			String taskUsersInsert = "INSERT INTO task_user(id_task,id_user) VALUES ";
			try {
				JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");
				String[][] taskTable = conn.executeQuery(testQuery, id_task);
				description = request.getParameter("description") == null? taskTable[1][2] : request.getParameter("description");
				id_task_status = request.getParameter("id_task_status") == null? Integer.parseInt(taskTable[1][3]) : Integer.parseInt(request.getParameter("id_task_status"));
				name = request.getParameter("name") == null?  taskTable[1][1] : request.getParameter("name"); 
				if(id_task_status == 3){
					updateQuery += ", ended_at=? ";
					now = new Timestamp(System.currentTimeMillis());
					conn.execute(updateQuery+updateFinisher, name, description,id_task_status,now,id_task);
					String[][] usersT = conn.executeQuery(getUsers, id_task);
					for(Integer id = 1; id < usersT.length; id++){
						try {
							NotificationSocket.sendNotification(Integer.parseInt(usersT[id][0]), "The task: \"" + name +"\"" + "Has been finished", "info");
						} catch(NullPointerException | IOException e) {
							System.out.println("User to be notified is not online.");
						}
					}
				}
				else{
					updateQuery += updateFinisher;
					conn.execute(updateQuery, name, description,id_task_status,id_task);
				}
				String created_at = null;
				String status = null;
				String projectName = null;
				String[] userNames = null;
				String[] userRoles = null;
				
				String[][] currentUsers = conn.executeQuery(getUsers, id_task);
				String[] currentUserIds = null;
				
				if(currentUsers.length > 1){
					currentUserIds = new String[currentUsers.length - 1];
					for(Integer i = 1 ; i < currentUsers.length ; i++){
						currentUserIds[i-1] = currentUsers[i][0];
					}
				}
				
				if(request.getParameter("assigned_users") != null){
					String[] us = request.getParameter("assigned_users").split(",");
					synchronized(us) {
						Integer count = us.length;
						if (currentUserIds != null) {
								List<String> tmpUs = Arrays.asList(us);
								List<String> currUs =  Arrays.asList(currentUserIds);
								ArrayList<Integer> idNums = new ArrayList<>();
								for(String str : tmpUs){
									if(currUs.contains(str)){
									}
									else idNums.add(Integer.parseInt(str));
								}
								users = idNums.toArray(new Integer[1]);
						}
						else {
							ArrayList<Integer> idNums = new ArrayList<>();
							for(String str : us){
								idNums.add(Integer.parseInt(str));
							}
							users = idNums.toArray(new Integer[1]);
						}
						if (users != null && users.length>0) {
							
							String taskUsersQuery = taskUsersInsert;
							for(Integer i = 0; i < users.length; i++){
								if(i == users.length -1){
									taskUsersQuery += "( " + id_task + ","+ users[i] + " )";
								}
								else{
									taskUsersQuery += "( " + id_task + " , "+ users[i] + " ), ";
								}
								
								try {
									NotificationSocket.sendNotification(users[i], "You've been assigned to the task: \"" + name +"\"", "info");
								} catch(NullPointerException | IOException e) {
									System.out.println("User to be notified is not online.");
								}
								
							}
							conn.execute(taskUsersQuery);
						}
					}
				}
				taskTable = conn.executeQuery(getQuery, id_task);
				name = taskTable[1][1];
				description = taskTable[1][2]; 
				created_at = taskTable[1][3];
				status = taskTable[1][5];
				projectName= taskTable[1][6];
				String ended_at = taskTable[1][7];
				Integer id_project = Integer.parseInt(taskTable[1][8]);
				Integer id_leader = Integer.parseInt(taskTable[1][9]);
				String[][] usersTable = conn.executeQuery(getUsers, id_task);
				YaySonArray ysa = usersTable.length < 2 ? null : new YaySonArray();
				if(ysa != null){
					for(Integer i = 1; i < usersTable.length; i++){
						YaySon ys = new YaySon();
						ys.add("name", usersTable[i][1]);
						ys.add("role",usersTable[i][2]);
						ysa.push(ys);
					}
				}
				
				if (isProjectCompleted(id_project)) {
			    	String usersQuery = "select users.id_user from users where id_role=1 or id_user=?";
					String[][] usersToNotifyTable = conn.executeQuery(usersQuery, id_leader);
					for(Integer i = 1; i < usersToNotifyTable.length; i++) {
						try {
							System.out.println(usersToNotifyTable[i][0]);
							NotificationSocket.sendNotification(Integer.parseInt(usersToNotifyTable[i][0]), "Project \"" + projectName +"\" has been completed", "success");
						} catch(NullPointerException | IOException e) {
							System.out.println("User to be notified is not online.");
						}
					}
				}
				
				YaySon task = new YaySon();
				task.add("id_task", id_task);
				task.add("id_project", projectName);
				task.add("name", name);
				task.add("description", description);
				task.add("created_at", created_at);
				task.add("status", status);
				task.add("ended_at", ended_at);
				task.add("Users", ysa == null? new YaySonArray(): ysa);
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
    
    private boolean isProjectCompleted(Integer id_project) {
		JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");
    	String countQuery = "select count(id_task) from task inner join project on task.id_project=project.id_project where task.id_project=? and task.ended_at is null group by id_task";
		String[][] countTable = conn.executeQuery(countQuery, id_project);
		System.out.println(countTable.length <= 1);
		return countTable.length <= 1;
    }

}
