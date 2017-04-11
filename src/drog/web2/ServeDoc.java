package drog.web2;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import darb.web2.JDBConnection;
import darb.web2.yayson.YaySon;

/**
 * Servlet implementation class ServeDoc
 */
@WebServlet("/static/docs")
public class ServeDoc extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ServeDoc() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		YaySon res = new YaySon();
		Integer id_document = Integer.parseInt(request.getParameter("id_document"));
		HttpSession session = request.getSession();
		User user = (User) request.getAttribute("user");
		if (session.isNew()) {
			res.add("status", 403);
			res.add("error", "No permission to access this resource");
			response.setHeader("Content-Type", "application/json" );
			response.setStatus(res.getInteger("status"));
			response.getWriter().println(res.toJSON());
		} 
		else {
				String[][] docTable = getDocumentData(id_document);
				if(docTable != null){
					try{
						response.setContentType("file");

				        // Assume file name is retrieved from database
				        // For example D:\\file\\test.pdf
						String name = docTable[1][1];
				        String path = docTable[1][2];	
				        File my_file = new File(path);
				        response.setHeader("Content-disposition","attachment; filename="+name);
				        // This should send the file to browser
				        OutputStream out = response.getOutputStream();
				        FileInputStream in = new FileInputStream(my_file);
				        byte[] buffer = new byte[4096];
				        int length;
				        while ((length = in.read(buffer)) > 0){
				           out.write(buffer, 0, length);
				        }
				        in.close();
				        out.flush();
					} catch (Exception e){
						res.add("status",500);
						res.add("error","IT HAPPENED");
						response.setHeader("Content-Type", "application/json" );
						response.setStatus(res.getInteger("status"));
						response.getWriter().println(res.toJSON());
					}
				}
				else{
					res.add("status",404);
					res.add("error","Resource not found");
					response.setHeader("Content-Type", "application/json" );
					response.setStatus(res.getInteger("status"));
					response.getWriter().println(res.toJSON());
				}
			}
		}
		
	

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	private String[][] getDocumentData(Integer id_document){
		String [][] res = null;
		String getQuery = "SELECT document.id_document, document.name, document.path "
				+ "FROM document "
				+ "WHERE document.id_document=?";
		try {
			JDBConnection conn = new JDBConnection("localhost", 5432, "my_business_tool", "postgres", "masterkey");
			String[][] documentTable = conn.executeQuery(getQuery, id_document);
			res = documentTable;
		} catch(Exception e) {
			e.printStackTrace();
		}
		return res;
	}
	
}
