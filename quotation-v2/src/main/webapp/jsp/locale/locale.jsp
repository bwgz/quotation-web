<%@ page trimDirectiveWhitespaces="true" %>
<%@ page contentType="application/json; charset=UTF-8" %>
<%
String date = new java.util.Date().toString();

response.setHeader("Access-Control-Allow-Origin","*");
response.setHeader("Date", date);
response.setHeader("Expires", date);
response.setHeader("Cache-Control","private, max-age=0, must-revalidate, no-transform");
%>
{"language":"<%= request.getLocale().toString() %>", "date":"<%= ((java.text.SimpleDateFormat) java.text.DateFormat.getDateInstance(java.text.DateFormat.SHORT, request.getLocale())).toPattern().replace("yy", "yyyy") %>"}
