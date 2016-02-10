/* example.cpp */

#include <stdio.h>
#include "graph.h"

int main()
{
	typedef Graph<int,int,int> GraphType;
	GraphType *g = new GraphType(/*estimated # of nodes*/ 3, /*estimated # of edges*/ 2); 

	g -> add_node(); 
	g -> add_node(); 
	g -> add_node(); 
	
	g -> edit_tweights(0, 115, 0);
	g -> edit_tweights(1, 83, 115);
	g -> edit_tweights(2, 0, 83);

	g -> add_edge(0, 1, 79, 0);
	g -> add_edge(1, 2, 0, 79);
	
	int flow = g -> maxflow();

	printf("Flow = %d\n", flow);
	printf("Minimum cut:\n");
	
	if (g->what_segment(0) == GraphType::SOURCE) {printf("node0 is in the SOURCE set\n");}
	else
	{
		printf("node0 is in the SINK set\n");}
	
	if (g->what_segment(1) == GraphType::SOURCE) printf("node1 is in the SOURCE set\n");
	else printf("node1 is in the SINK set\n");

	if (g->what_segment(2) == GraphType::SOURCE) printf("node2 is in the SOURCE set\n");
	else printf("node2 is in the SINK set\n");

	g -> edit_tweights(0, 15, 5);
	/* Re-computing max-flow */
	flow = g -> maxflow(true);

	/* Printing the results */
	printf("Flow = %d\n", flow);
	printf("Minimum cut:\n");
	
	if (g->what_segment(0) == GraphType::SOURCE) printf("node0 is in the SOURCE set\n");
	else printf("node0 is in the SINK set\n");
	if (g->what_segment(1) == GraphType::SOURCE) printf("node1 is in the SOURCE set\n");
	else printf("node1 is in the SINK set\n");

	g -> edit_edge(0,1,1,4);
	/* Re-computing max-flow */
	flow = g -> maxflow(true);

	/* Printing the results */
	printf("Flow = %d\n", flow);
	printf("Minimum cut:\n");
	
	if (g->what_segment(0) == GraphType::SOURCE) printf("node0 is in the SOURCE set\n");
	else printf("node0 is in the SINK set\n");
	if (g->what_segment(1) == GraphType::SOURCE) printf("node1 is in the SOURCE set\n");
	else printf("node1 is in the SINK set\n");


	delete g;
	getchar();
	return 0;
}
