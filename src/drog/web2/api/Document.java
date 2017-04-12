package drog.web2.api;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Timestamp;
import java.util.Collections;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

import darb.web2.JDBConnection;
import darb.web2.yayson.YaySon;
import darb.web2.yayson.YaySonArray;
import drog.web2.User;

/**
 * Servlet implementation class Document
 */
@WebServlet("/api/task/docs")
@MultipartConfig
public class Document extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private static final String _path = "C:/BusinessDocs";
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Document() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// GETS ALL THE DOCS RELATED TO A TASK, TO OPEN IN FS LIKE A FAGGOT (Could instead send ONE at a time)	
		response.setHeader("Content-Type", "application/json" );
		YaySon res = new YaySon();
		Integer id_task = request.getParameter("id_task") == null ? null : Integer.parseInt(request.getParameter("id_task"));
		HttpSession session = request.getSession();
		User user = (User) request.getAttribute("user");
		if (session.isNew()) {
			res.add("status", 403);
			res.add("error", "No permission to access this resource");
		} 
		else{
			if(id_task != null){
				res = getDocumentsFromTask(id_task);
			}
			else{
				res.add("status",403);
				res.add("error","Wrong arguments");
			}
		}
		response.setStatus(res.getInteger("status"));
		response.getWriter().println(res.toJSON());
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		HttpSession session = request.getSession();		
		User user = (User) session.getAttribute("user");
		response.setHeader("Content-Type", "application/json" );
		YaySon res = new YaySon();
		if (session.isNew()) {
			res.add("status", 403);
			res.add("error", "No permission to access this resource");
		} else {
			Part file = request.getPart("file");
			Integer id_task = Integer.parseInt(request.getParameter("id_task"));
			String name = getFileName(file);
			saveFile(file);

			String insertQuery = "INSERT INTO document(name, path) VALUES (?,?) RETURNING id_document";
			String insertTaskDocument = "INSERT INTO task_document(id_task, id_document) VALUES (?,?)";
			String getQuery = "SELECT id_document, name, path FROM document WHERE id_document = ?";
			try {
				JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");
				String[][] insert_result = conn.executeQuery(insertQuery, name,_path+"/"+name);
				Integer id_document = Integer.parseInt(insert_result[1][0]);
				conn.execute(insertTaskDocument, id_task,id_document);
				String[][] documentTable = conn.executeQuery(getQuery, id_document);
				YaySon document = new YaySon();
				document.add("id_document", documentTable[1][0]);
				document.add("name", documentTable[1][1]);
				document.add("path", documentTable[1][2]);
				System.out.println(documentTable[1][0]);
				res.add("status", 200);
				res.add("data", document);
			} catch(Exception e) {
				e.printStackTrace();
				res.add("status", 500);
			}
		}		
		
		response.setStatus(res.getInteger("status"));
		response.getWriter().print(res.toJSON());
	}
	
	private YaySon getDocumentsFromTask (Integer id_task){
		YaySon res = new YaySon();
		String query = "SELECT document.id_document, document.name ,document.path "
				+ "FROM document "
				+ "INNER JOIN task_document ON document.id_document = task_document.id_document "
				+ "INNER JOIN task ON task_document.id_task = task.id_task "
				+ "WHERE task.id_task = ?";
		String[][] docsTable = null;
		try{
			JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");						
			docsTable = conn.executeQuery(query, id_task);
			YaySonArray docs= new YaySonArray();
			for(Integer i =1 ; i < docsTable.length ; i++){
				YaySon doc = new YaySon();
				doc.add("id_document", docsTable[i][0]);
				doc.add("name", docsTable[i][1]);
				doc.add("path", docsTable[i][2]);
				docs.push(doc);
			}
			res.add("status",200);
			res.add("data",docs);
		}catch (Exception e){
			res.add("status",500);
			res.add("error","Invalid value");
		}
		return res;
	}
	
	private void saveFile(Part file) throws IOException{
		InputStream is  = file.getInputStream();
		OutputStream os = null;
		File f = new File(_path);
		if(!f.exists()){
			    boolean result = false;
			    try{
			        f.mkdir();
			        result = true;
			    } 
			    catch(SecurityException se){
			        //handle it
			    }        
			    if(result) {    
			        System.out.println("DIR created");  
			    }
		}
		try{
			String base = _path;
			os = new FileOutputStream( base + "/" + this.getFileName(file));
			int read = 0;
			byte[] bytes = new byte[1024];
			while( (read = is.read(bytes)) != -1){
				os.write(bytes,0,read);
			};
		}
		catch (Exception e){
			e.printStackTrace();
		}
		finally{
			if(is != null) is.close();
			if(os != null) os.close();
		}
	}
	
	private String getFileName(Part file){
		for(String content : file.getHeader("content-disposition").split(";")){
			if(content.trim().startsWith("filename")){
				return content.substring(content.indexOf("=") + 1).trim().replace("\"", "");
			}
		}
		return null;
	}
	
}
