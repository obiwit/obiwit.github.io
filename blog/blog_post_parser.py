## A relatively simple python parser from (a variant of) markdown to an HTML blog post
# for my personal website and blog, obiwit.com
## For now, this is a very simple text parser, that creates only the file header,
# the text headers, paragraphs, bolds, italics, footnotes and unordered lists


import re
import sys
import datetime
from itertools import cycle


def help():
    print("""---- HELP ----

The input file should have the following format:
    - Title on first line, without any markdown, optionally followed by a blank line;
    - The text's paragraphs should follow, with each paragraph separated by a blank line;
        + Asterisks denote bold text like *so*;
        + Double hats denote italic text like $$so$$;
        + Pounds denote headings like # so (the heading and pound symbols must be separated by a space; 1 to 6 pound symbols are currently supported);
        + To use a footnote, use an underscore followed by a curly brace, the footnote text and a closing curly brace like _{so} (at the moment multi-line footnotes (i.e. a newline inside the footnote) aren't supported);
        + Double hyphens denote an unordered list item (the parser automatically detects the beginning and end of the unordered list), like -- so (again, the item and hyphens must be separated by a space);
        + No other markdown is currently supported.

kthxbai! :D""")



def systematic_cycle_replace(line, replace_char, replace_list):
    cyc = cycle(replace_list)
    line = ''.join([next(cyc) if c == replace_char else c for c in line])
    return line


def parse(in_file, out_file, author, meta_author, date):
    with open(in_file) as f_in:
        with open(out_file, "w") as f_out:
            # create header for jekyll and for blog
            title = f_in.readline().split('\n')[0]
            f_out.write("""---
layout: blog
title: """+ meta_author + "'s " + meta_title + " - " + title +"""
author: """+meta_author+"""
---

<div id="ml-blog">
  <h1 id="title">"""+title+"""</h1>
  <h6 id="post-info">By """+author+""", <span class="small">edited on """+date+"""</span></h6>
""")

            # flags for <p>'s
            open_paragraph = False
            no_paragraph_yet = True

            # flag for <strong>'s
            open_bold = False

            # flag for <em>'s
            open_italics = False

            # flag for <ul>'s
            open_ul = False

            # a buffer for footnotes
            end_of_file_buffer = "</p>\n"
            footnote_counter = 0

            # read post itself
            for line in f_in:

                # remove \n at end of line
                line = line.split('\n')[0]

                # add bolds
                bolds_num = line.count("*")
                if bolds_num > 0:
                    bold_list = ["<strong>", "</strong>"] if not open_bold else ["</strong>", "<strong>"]
                    line = systematic_cycle_replace(line, "*", bold_list)

                # add italics
                italics_num = line.count("$$")
                if italics_num > 0:
                    italics_list = ["<em>", "</em>"] if not open_italics else ["</em>", "<em>"]
                    line = systematic_cycle_replace(line.replace("$$", "`"), "`", italics_list)

                # add foot notes
                footnotes_num = line.count("_{")
                line = re.split(' _{|}', line)
                list_index = 1
                for i in range(0, footnotes_num):
                    footnote_counter += 1

                    end_of_file_buffer += "  <br/><sup id=\"fn"+str(footnote_counter)+"\">"+str(footnote_counter)+". ["+line[list_index]+"] <a href=\"#ref"+str(footnote_counter)+"\" title=\"Jump back to footnote "+str(footnote_counter)+" in the text.\">↩</a></sup>\n"
                    # Note - Footnote HTML code based on Karl Winegardner's (http://karlwinegardner.blogspot.pt/2011/02/how-to-create-footnotes-in-html.html)

                    line[list_index] = "<sup><a href=\"#fn"+str(footnote_counter)+"\" id=\"ref"+str(footnote_counter)+"\">"+str(footnote_counter)+"</a></sup>"

                    list_index += 2

                line = ''.join(line)

                # parse headers (denoted by one or more #)
                header_str = line.split(' ', 1)
                if ((header_str[0].count('#') == len(header_str[0])) and not line == ""):
                    header_size = str(len(header_str[0]))
                    f_out.write("  <h"+header_size+">"+ header_str[1] +"</h"+header_size+">\n")
                elif (header_str[0] == "--"):
                    if open_ul:
                        f_out.write("    <li>"+ header_str[1] +"</li>\n")
                    else:
                        if open_paragraph:
                            f_out.write("</p>\n")
                            open_paragraph = False
                        open_ul = True
                        f_out.write("  <ul>\n    <li>"+ header_str[1] +"</li>\n")
                elif (no_paragraph_yet or not open_paragraph):
                    if open_ul:
                        f_out.write("  </ul>\n")
                        open_ul = False
                    f_out.write("  <p>"+line)
                    open_paragraph = True
                    no_paragraph_yet = False
                elif (not line == ""):
                    f_out.write(line)
                else:
                    f_out.write("</p>\n")
                    open_paragraph = False


            f_out.write(end_of_file_buffer+"</div>")



if __name__ == "__main__":
    print ("---- obiwit's HTML parser ----")

    if (len(sys.argv) > 1 and (sys.argv[1] == "--help" or sys.argv[1] == "-h")):
        help()

    else:
        # in and out files
        in_file = sys.argv[1] if len(sys.argv) > 1 else "in.txt"
        in_file_path = in_file.split('.')
        out_file = in_file_path[0] + "_parsed.html"

        # author
        author = sys.argv[2] if len(sys.argv) > 2 else "Beatriz Borges R"

        # post date
        now = datetime.datetime.now()
        date = sys.argv[3] if len(sys.argv) > 3 else (now.strftime("%b %d, ") + str(now.year+10000))

        # meta-author
        meta_author = "obiwit"
        if len(sys.argv) > 4:
            if (sys.argv[4] == "--same_auth" or sys.argv[4] == "-s"):
                meta_author = author
            else:
                meta_author = sys.argv[4]

        # meta-title
        meta_title = sys.argv[5] if len(sys.argv) > 5 else "Machine Learning blog"

        # display info
        print ("\nInput file path:", in_file)
        print ("Output file path:", out_file)
        print ("Author:", author)
        print ("Meta-author:", meta_author)
        print ("Date:", date)

        # parse in_file
        print("\nparsing... ", end='')
        parse(in_file, out_file, author, meta_author, date)
        print("done!")
